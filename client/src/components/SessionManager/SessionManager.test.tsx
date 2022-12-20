import { render, screen } from '@testing-library/react'
import { SessionManager } from './SessionManager'
import userEvent from '@testing-library/user-event'
jest.mock('next-auth/react')
import { useSession, signIn } from 'next-auth/react'
// import { REFRESH_TOKEN_ERROR } from 'constants/errors'
// import { cognitoSignOut } from 'utils/signout/cognitoSignOut'
const mockUseSession = useSession as jest.Mock
const mockSignIn = signIn as jest.Mock

describe('SessionManager', () => {
  const renderSessionManager = (
    forceOpen?: boolean,
    forceExpireTime?: string
  ) => {
    if (forceOpen !== undefined && forceExpireTime !== undefined) {
      render(<SessionManager />)
    } else {
      render(
        <SessionManager
          forceOpen={forceOpen}
          forceExpireTime={forceExpireTime}
        />
      )
    }
    const queryForModalWindow = () => screen.queryByTestId('modalWindow')

    const queryForStayLoggedInButton = () => {
      return screen.queryByRole('button', { name: 'timeout.stay_logged_in' })
    }
    const queryForLogOutButton = () => {
      return screen.queryByRole('button', { name: 'timeout.log_out' })
    }
    return {
      queryForModalWindow,
      queryForStayLoggedInButton,
      queryForLogOutButton,
    }
  }
  afterEach(() => {
    mockSignIn.mockClear()
  })
  it('Does not render if there is no session', () => {
    mockUseSession.mockReturnValue({
      data: undefined,
      status: 'unauthenticated',
    })
    const { queryForModalWindow } = renderSessionManager()
    screen.debug(undefined, 300000)
    console.log(queryForModalWindow())
    expect(queryForModalWindow()).not.toBeInTheDocument()
  })
  it('Renders if session exists and is timed out', () => {
    const expireDate = new Date(Date.now() + 2000)
    console.log('expire data  is ' + expireDate)
    mockUseSession.mockReturnValue({
      data: { expires: expireDate, WhoAmI: undefined },
      status: 'authenticated',
    })
    const { queryForModalWindow } = renderSessionManager()
    // console.log()
    screen.debug(undefined, 300000)
    expect(queryForModalWindow()).toBeInTheDocument()
  })
  it('Reloads the session with stay logged in clicked', async () => {
    const expireDate = new Date(Date.now() + 15000)
    mockUseSession.mockReturnValue({
      data: { expires: expireDate, WhoAmI: undefined },
      status: 'authenticated',
    })

    const user = userEvent.setup()
    const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent')
    const { queryForModalWindow, queryForStayLoggedInButton } =
      renderSessionManager()
    const stayLoggedInBtn = queryForStayLoggedInButton()

    //check window exits with the login button
    expect(queryForModalWindow()).toBeInTheDocument()
    expect(stayLoggedInBtn).toBeInTheDocument()

    //click login and check that the session refresh event was triggered
    await user.click(stayLoggedInBtn as HTMLElement)
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event))
    expect(dispatchEventSpy.mock.calls[0][0].type).toBe('visibilitychange')
    screen.debug(undefined, 300000)
  })
  it('Logs out', async () => {
    const expireDate = new Date(Date.now() + 15000)
    mockUseSession.mockReturnValue({
      data: { expires: expireDate, WhoAmI: undefined },
      status: 'authenticated',
    })
    //   const signoutMock=jest.mock(cognitoSignOut)
    const user = userEvent.setup()
    const { queryForLogOutButton } = renderSessionManager()
    // queryForModalWindow,
    const logoutBtn = queryForLogOutButton()
    expect(logoutBtn).toBeInTheDocument()
    await user.click(logoutBtn as HTMLElement)
    // expect(queryForModalWindow()).not.toBeInTheDocument()
    // expect(signoutMock).toBeCalled()
  })
})
