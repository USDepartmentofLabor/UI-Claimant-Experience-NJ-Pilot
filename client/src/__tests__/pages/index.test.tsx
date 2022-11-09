import { render, screen } from '@testing-library/react'
import Home from 'pages'
import userEvent from '@testing-library/user-event'

jest.mock('next-auth/react')
import { useSession, signIn, signOut } from 'next-auth/react'

const mockUseSession = useSession as jest.Mock
;(signIn as jest.Mock).mockImplementation(() => jest.fn())
;(signOut as jest.Mock).mockImplementation(() => jest.fn())

describe('home page', () => {
  const renderHomePage = () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1 })

    const loader = screen.queryByTestId('page-loading')
    const signInButton = screen.queryByRole('button', {
      name: 'Sign in with Cognito',
    })
    const signOutButton = screen.queryByRole('button', {
      name: 'Sign out',
    })

    return {
      heading,
      loader,
      signInButton,
      signOutButton,
    }
  }

  it('renders when logged out', async () => {
    const user = userEvent.setup()

    mockUseSession.mockReturnValue({
      status: 'unauthenticated',
      data: null,
    })

    const { heading, signInButton, signOutButton } = renderHomePage()

    expect(heading.textContent).toContain('heading')
    expect(signInButton).toBeInTheDocument()
    expect(signInButton).toHaveClass('usa-button')
    expect(signOutButton).not.toBeInTheDocument()

    await user.click(signInButton as HTMLElement)

    expect(signIn).toHaveBeenCalledTimes(1)
    expect(signIn).toHaveBeenCalledWith('cognito')
  })

  it('renders when loading', () => {
    mockUseSession.mockReturnValue({
      status: 'loading',
      data: null,
    })

    const { heading, loader, signInButton, signOutButton } = renderHomePage()

    expect(heading).toBeInTheDocument()
    expect(loader).toBeInTheDocument()
    expect(signInButton).not.toBeInTheDocument()
    expect(signOutButton).not.toBeInTheDocument()
  })

  it('renders when logged in', async () => {
    const user = userEvent.setup()

    mockUseSession.mockReturnValue({
      status: 'authenticated',
      data: {
        user: {
          email: 'testy.mctestface@test.com',
        },
        whoAmI: {
          firstName: 'Harry',
          lastName: 'Potter',
          middleInitial: 'J',
          birthdate: '1980-07-31',
          email: 'boy_who_lived@hogwarts.com',
          phone: '2028675309',
        },
      },
    })

    const { heading, signInButton, signOutButton } = renderHomePage()

    expect(heading).toBeInTheDocument()
    expect(signInButton).not.toBeInTheDocument()
    expect(signOutButton).toBeInTheDocument()
    expect(signOutButton).toHaveClass('usa-button')

    await user.click(signOutButton as HTMLElement)

    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it.each([null, { user: null }])(
    'instructs the user to sign in if the session is missing a user',
    async (data) => {
      mockUseSession.mockReturnValue({
        status: 'authenticated',
        data: data,
      })

      const { heading, signInButton, signOutButton } = renderHomePage()

      expect(heading).toBeInTheDocument()
      expect(signInButton).toBeInTheDocument()
      expect(signOutButton).not.toBeInTheDocument()
    }
  )
})
