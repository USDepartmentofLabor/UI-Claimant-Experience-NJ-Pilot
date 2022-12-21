import { act, render, screen } from '@testing-library/react'
import { SessionManager } from './SessionManager'
import userEvent from '@testing-library/user-event'
jest.mock('next-auth/react')
import { useSession, signIn } from 'next-auth/react'
const mockUseSession = useSession as jest.Mock
const mockSignIn = signIn as jest.Mock
const mockCognitoSignOut = jest.fn(() => Promise.resolve())
jest.mock('utils/signout/cognitoSignOut', () => ({
  cognitoSignOut: () => mockCognitoSignOut(),
}))

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
    mockCognitoSignOut.mockClear()
  })

  it('Does not render if there is no session', () => {
    mockUseSession.mockReturnValue({
      data: undefined,
      status: 'unauthenticated',
    })
    const { queryForModalWindow } = renderSessionManager()
    expect(queryForModalWindow()).not.toBeInTheDocument()
  })

  it('Renders if session exists and is timed out', () => {
    const expireDate = new Date(Date.now() + 2000)
    mockUseSession.mockReturnValue({
      data: { expires: expireDate, WhoAmI: undefined },
      status: 'authenticated',
    })

    const { queryForModalWindow } = renderSessionManager()
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
  })

  it('Logs out', async () => {
    const expireDate = new Date(Date.now() + 15000)
    mockUseSession.mockReturnValue({
      data: { expires: expireDate, WhoAmI: undefined },
      status: 'authenticated',
    })

    const user = userEvent.setup()
    const { queryForLogOutButton } = renderSessionManager()

    const logoutBtn = queryForLogOutButton()
    expect(logoutBtn).toBeInTheDocument()
    await user.click(logoutBtn as HTMLElement)
    expect(mockCognitoSignOut).toHaveBeenCalledTimes(1)
  })

  it('can open and set the time to the optional parameters', () => {
    const expireDate = new Date(Date.now() + 15000)
    mockUseSession.mockReturnValue({
      data: { expires: expireDate, WhoAmI: undefined },
      status: 'authenticated',
    })

    //set expire to be 31 mins,
    // aka doutside of when it should normall open the modal
    const { queryForModalWindow } = renderSessionManager(
      true,
      new Date(Date.now() + 31 * 60 * 1000).toString()
    )

    //should be forced open
    expect(queryForModalWindow()).toBeInTheDocument()
  })

  it('should refresh session when user interacts with window', async () => {
    const expireDate = new Date(Date.now() + 31 * 60 * 1000)
    mockUseSession.mockReturnValue({
      data: { expires: expireDate, WhoAmI: undefined },
      status: 'authenticated',
    })
    render(
      <div>
        <SessionManager />
        <h1 data-testid="test-element">non hidden element</h1>
      </div>
    )
    const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent')
    const user = userEvent.setup()
    await user.click(screen.getByTestId('test-element') as HTMLElement)
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event))
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      await user.click(screen.getByTestId('test-element') as HTMLElement)
      expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event))
      expect(dispatchEventSpy.mock.calls[0][0].type).toBe('visibilitychange')
    })
  })
})
