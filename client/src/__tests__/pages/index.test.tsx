import { render, screen } from '@testing-library/react'
import Home from 'pages'
import userEvent from '@testing-library/user-event'
import { Routes } from 'constants/routes'

jest.mock('next-auth/react')
import { useSession, signIn, signOut } from 'next-auth/react'

const mockUseSession = useSession as jest.Mock
;(signIn as jest.Mock).mockImplementation(() => jest.fn())
;(signOut as jest.Mock).mockImplementation(() => jest.fn())

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

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
    const taxDocButton = screen.queryByRole('button', {
      name: 'tax_doc_button',
    })
    const updatePaymentButton = screen.queryByRole('button', {
      name: 'Update payment info',
    })

    return {
      heading,
      loader,
      signInButton,
      signOutButton,
      taxDocButton,
      updatePaymentButton,
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

    const {
      heading,
      loader,
      signInButton,
      signOutButton,
      updatePaymentButton,
      taxDocButton,
    } = renderHomePage()

    expect(heading).toBeInTheDocument()
    expect(loader).toBeInTheDocument()
    expect(signInButton).not.toBeInTheDocument()
    expect(signOutButton).not.toBeInTheDocument()
    expect(taxDocButton).not.toBeInTheDocument()
    expect(updatePaymentButton).not.toBeInTheDocument()
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

    const {
      heading,
      signInButton,
      signOutButton,
      updatePaymentButton,
      taxDocButton,
    } = renderHomePage()

    expect(heading).toBeInTheDocument()
    expect(signInButton).not.toBeInTheDocument()
    expect(signOutButton).toBeInTheDocument()
    expect(signOutButton).toHaveClass('usa-button')
    expect(taxDocButton).toBeInTheDocument()
    expect(taxDocButton).toHaveClass('usa-button')
    expect(taxDocButton).toHaveClass('usa-button--secondary')
    expect(updatePaymentButton).toBeInTheDocument()
    expect(updatePaymentButton).toHaveClass('usa-button')
    expect(updatePaymentButton).toHaveClass('usa-button--secondary')

    await user.click(signOutButton as HTMLElement)

    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it('takes the user to the tax download page', async () => {
    const user = userEvent.setup()

    const mockNavigateTaxDoc = jest.fn()
    mockRouter.mockImplementation(() => ({
      push: mockNavigateTaxDoc,
    }))

    const { taxDocButton } = renderHomePage()

    await user.click(taxDocButton as HTMLElement)
    expect(mockNavigateTaxDoc).toHaveBeenCalledTimes(1)
    expect(mockNavigateTaxDoc).toHaveBeenCalledWith(Routes.TAX_DOCUMENTS)
  })

  it('takes the user to the update payment form page', async () => {
    const user = userEvent.setup()

    const mockNavigateUpdatePayment = jest.fn()
    mockRouter.mockImplementation(() => ({
      push: mockNavigateUpdatePayment,
    }))

    const { updatePaymentButton } = renderHomePage()

    await user.click(updatePaymentButton as HTMLElement)
    expect(mockNavigateUpdatePayment).toHaveBeenCalledTimes(1)
    expect(mockNavigateUpdatePayment).toHaveBeenCalledWith(
      Routes.UPDATE_PAYMENT_INFO
    )
  })

  it.each([null, { user: null }])(
    'instructs the user to sign in if the session is missing a user',
    async (data) => {
      mockUseSession.mockReturnValue({
        status: 'authenticated',
        data: data,
      })

      const {
        heading,
        signInButton,
        signOutButton,
        updatePaymentButton,
        taxDocButton,
      } = renderHomePage()

      expect(heading).toBeInTheDocument()
      expect(signInButton).toBeInTheDocument()
      expect(signOutButton).not.toBeInTheDocument()
      expect(taxDocButton).not.toBeInTheDocument()
      expect(updatePaymentButton).not.toBeInTheDocument()
    }
  )
  it('Shows a success alert when a claim form has been submitted', () => {
    mockRouter.mockImplementation(() => ({
      query: { completed: true },
      asPath: '/',
    }))
    renderHomePage()
    const alert = screen.getByTestId('alert')
    expect(alert).toBeInTheDocument()
  })
})
