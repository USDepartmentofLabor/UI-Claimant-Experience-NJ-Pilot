import { render, screen, waitFor } from '@testing-library/react'
import { ActiveSessionHandler } from 'components/ActiveSessionHandler/ActiveSessionHandler'

jest.mock('next-auth/react')
import { useSession, signIn } from 'next-auth/react'
import { REFRESH_TOKEN_ERROR } from 'constants/errors'
const mockUseSession = useSession as jest.Mock
const mockSignIn = signIn as jest.Mock

describe('ActiveSessionHandler', () => {
  const renderActiveSessionHandler = () => {
    render(
      <ActiveSessionHandler>
        <div>children</div>
      </ActiveSessionHandler>
    )
    const children = screen.queryByText('children')
    return {
      children,
    }
  }

  afterEach(() => {
    mockSignIn.mockClear()
  })

  it('Renders properly without a session', () => {
    mockUseSession.mockReturnValue({
      data: undefined,
      status: 'unauthenticated',
    })
    const { children } = renderActiveSessionHandler()

    expect(children).toBeInTheDocument()
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('handles refresh token errors', async () => {
    mockUseSession.mockReturnValue({
      data: { error: REFRESH_TOKEN_ERROR },
      status: 'authenticated',
    })

    renderActiveSessionHandler()

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1)
      expect(mockSignIn).toHaveBeenCalledWith('cognito')
    })
  })
})
