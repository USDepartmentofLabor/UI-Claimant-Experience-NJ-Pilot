import { render, screen, waitFor } from '@testing-library/react'
import Home from 'pages'
import userEvent from '@testing-library/user-event'
import { Routes } from 'constants/routes'
import { useSession, signIn, signOut } from 'next-auth/react'
import { WrappingProviders } from 'utils/testUtils'
import clearAllMocks = jest.clearAllMocks

const mockAxiosPost = jest.fn().mockImplementation(() => {
  return { then: jest.fn() }
})

jest.mock('utils/http/serverHttpClient', () => ({
  post: (a: any, b: any) => mockAxiosPost(a, b),
}))

jest.mock('next-auth/react')

const mockUseSession = useSession as jest.Mock
;(signIn as jest.Mock).mockImplementation(() => jest.fn())
;(signOut as jest.Mock).mockImplementation(() => jest.fn())

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

const mockUseGetPartialClaim = jest.fn()
jest.mock('queries/useGetPartialClaim', () => ({
  useGetPartialClaim: () => mockUseGetPartialClaim(),
}))

afterEach(() => clearAllMocks())

describe('home page', () => {
  const renderHomePage = (claimFormValues = {}) => {
    render(
      <WrappingProviders claimFormValues={claimFormValues}>
        <Home />
      </WrappingProviders>
    )

    const heading = screen.getByRole('heading', { level: 1 })

    const loader = screen.queryByTestId('page-loading')
    const signInButton = screen.queryByRole('button', {
      name: 'header.signin',
    })
    const signOutButton = screen.queryByRole('button', {
      name: 'signout',
    })
    const taxDocButton = screen.queryByRole('button', {
      name: 'tax_doc_button',
    })
    const updatePaymentButton = screen.queryByRole('button', {
      name: 'update_payment_button',
    })
    const updateContactInfoButton = screen.queryByRole('button', {
      name: 'update_contact_info_button',
    })

    const resetButton = screen.queryByRole('button', {
      name: 'Reset claim (dev/test)',
    })

    const goToClaimButton = screen.queryByTestId('go-to-claim-form')

    return {
      heading,
      loader,
      signInButton,
      signOutButton,
      taxDocButton,
      updatePaymentButton,
      updateContactInfoButton,
      resetButton,
      goToClaimButton,
    }
  }

  const sessionData = {
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
  }

  const setMocks = (
    options: {
      session?: object
      getClaimIsLoading?: boolean
      partialClaimData?: object
    } = {}
  ) => {
    const session = options.session ? options.session : sessionData
    const getClaimIsLoading = options.getClaimIsLoading
      ? options.getClaimIsLoading
      : false
    const partialClaimData = options.partialClaimData
      ? options.partialClaimData
      : {}
    mockUseSession.mockReturnValue(session)
    mockUseGetPartialClaim.mockImplementation(() => ({
      isLoading: getClaimIsLoading,
      data: partialClaimData,
    }))
  }

  it('renders when logged out', async () => {
    const user = userEvent.setup()

    setMocks({
      session: {
        status: 'unauthenticated',
        data: null,
      },
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

    mockUseGetPartialClaim.mockImplementation(() => ({
      isLoading: false,
      data: {},
    }))

    const {
      heading,
      loader,
      signInButton,
      signOutButton,
      updatePaymentButton,
      taxDocButton,
      updateContactInfoButton,
    } = renderHomePage()

    expect(heading).toBeInTheDocument()
    expect(loader).toBeInTheDocument()
    expect(signInButton).not.toBeInTheDocument()
    expect(signOutButton).not.toBeInTheDocument()
    expect(taxDocButton).not.toBeInTheDocument()
    expect(updatePaymentButton).not.toBeInTheDocument()
    expect(updateContactInfoButton).not.toBeInTheDocument()
  })

  it('renders when logged in', async () => {
    const user = userEvent.setup()

    setMocks({ getClaimIsLoading: false })
    const {
      heading,
      signInButton,
      signOutButton,
      updatePaymentButton,
      taxDocButton,
      updateContactInfoButton,
    } = renderHomePage()

    expect(heading).toBeInTheDocument()
    expect(signInButton).not.toBeInTheDocument()
    expect(signOutButton).toBeInTheDocument()
    expect(signOutButton).toHaveClass('usa-button')
    expect(taxDocButton).toBeInTheDocument()
    expect(taxDocButton).toHaveClass('usa-button')
    expect(updatePaymentButton).toBeInTheDocument()
    expect(updatePaymentButton).toHaveClass('usa-button')
    expect(updateContactInfoButton).toBeInTheDocument()
    expect(updateContactInfoButton).toHaveClass('usa-button')

    await user.click(signOutButton as HTMLElement)

    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it('resets the claim when it clicks the reset button', async () => {
    process.env.NEXT_PUBLIC_APP_ENV = 'test'

    jest.mock('utils/http/serverHttpClient', () => ({
      post: (a: any, b: any) => mockAxiosPost(a, b),
    }))

    const user = userEvent.setup()

    setMocks()

    const { resetButton } = renderHomePage()

    expect(resetButton).toBeInTheDocument()

    if (resetButton) await user.click(resetButton)

    await waitFor(
      async () => await expect(mockAxiosPost).toHaveBeenCalledTimes(1)
    )
    expect(mockAxiosPost).toHaveBeenCalledWith('/partial-claim', {})
  })

  it('does not display the reset button if the environment is production', () => {
    process.env.NEXT_PUBLIC_APP_ENV = 'production'

    setMocks()

    const { resetButton } = renderHomePage()

    expect(resetButton).not.toBeInTheDocument()
  })

  it.each([null, { user: null }])(
    'instructs the user to sign in if the session is missing a user',
    async (data) => {
      setMocks({
        session: {
          status: 'authenticated',
          data: data,
        },
      })

      const {
        heading,
        signInButton,
        signOutButton,
        updatePaymentButton,
        taxDocButton,
        updateContactInfoButton,
      } = renderHomePage()

      expect(heading).toBeInTheDocument()
      expect(signInButton).toBeInTheDocument()
      expect(signOutButton).not.toBeInTheDocument()
      expect(taxDocButton).not.toBeInTheDocument()
      expect(updatePaymentButton).not.toBeInTheDocument()
      expect(updateContactInfoButton).not.toBeInTheDocument()
    }
  )

  describe('File a claim button', () => {
    it('takes a user to ssn page if there is no existing partial or completed claim', async () => {
      const user = userEvent.setup()

      setMocks()

      const mockFileAClaim = jest.fn()
      mockRouter.mockImplementation(() => ({
        push: mockFileAClaim,
      }))

      const { goToClaimButton } = renderHomePage()

      if (goToClaimButton) await user.click(goToClaimButton)
      expect(mockFileAClaim).toHaveBeenCalledTimes(1)
      expect(mockFileAClaim).toHaveBeenCalledWith(Routes.SSN)
    })
    it('takes a user to ssn page if it is not stored in an existing partial claim', async () => {
      const user = userEvent.setup()
      const partialClaim = { screener_current_country_us: true }

      setMocks({ partialClaimData: partialClaim })

      const mockFileAClaim = jest.fn()
      mockRouter.mockImplementation(() => ({
        push: mockFileAClaim,
      }))

      const { goToClaimButton } = renderHomePage(partialClaim)
      if (goToClaimButton) await user.click(goToClaimButton)
      expect(mockFileAClaim).toHaveBeenCalledTimes(1)
      expect(mockFileAClaim).toHaveBeenCalledWith(Routes.SSN)
    })

    it('takes a user to screener page if user has an ssn but screener values are not stored in a claim', async () => {
      const user = userEvent.setup()
      const partialClaim = { ssn: '111-22-3333' }

      setMocks({ partialClaimData: partialClaim })

      const mockFileAClaim = jest.fn()
      mockRouter.mockImplementation(() => ({
        push: mockFileAClaim,
      }))

      const { goToClaimButton } = renderHomePage(partialClaim)

      if (goToClaimButton) await user.click(goToClaimButton)

      expect(mockFileAClaim).toHaveBeenCalledTimes(1)
      expect(mockFileAClaim).toHaveBeenCalledWith(Routes.SCREENER)
    })

    it('takes a user to the first unfinished claim form page if user has an ssn and screener values', async () => {
      const user = userEvent.setup()

      const partialClaim = {
        ssn: '111-22-3333',
        screener_current_country_us: true,
        birthdate: '1933-03-15',
        can_begin_work_immediately: true,
        claimant_name: {
          first_name: 'Ruth',
          last_name: 'Ginsburg',
          middle_initial: 'B',
        },
        claimant_phone: { number: '5105551234' },
        email: 'kim@truss.works',
        filed_in_last_12mo: false,
        lived_outside_nj_when_working_nj: false,
      }

      setMocks({ partialClaimData: partialClaim })

      const mockFileAClaim = jest.fn()
      mockRouter.mockImplementation(() => ({
        push: mockFileAClaim,
      }))

      const { goToClaimButton } = renderHomePage(partialClaim)
      expect(goToClaimButton).toHaveTextContent('continue_to_screener_button')
      if (goToClaimButton) await user.click(goToClaimButton)
      expect(mockFileAClaim).toHaveBeenCalledTimes(1)
      expect(mockFileAClaim).toHaveBeenCalledWith(Routes.CLAIM.IDENTITY)
    })
  })
})
