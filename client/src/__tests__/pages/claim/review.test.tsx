import { render, screen } from '@testing-library/react'
import Review from 'pages/claim/review'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider, QueryClient } from 'react-query'
import { useSaveCompleteClaim } from 'queries/useSaveCompleteClaim'
import { useSubmitClaim } from 'queries/useSubmitClaim'
import { Routes } from 'constants/routes'
import {
  ClaimFormContext,
  ClaimFormContextType,
} from 'contexts/ClaimFormContext'
import { ClaimantInput } from 'types/claimantInput'
import { WrappingProviders } from 'utils/testUtils'

jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')

const mockUseGetBetaTestReview = jest.fn().mockImplementation(() => {
  return {
    refetch: jest.fn().mockImplementation(() => {
      return {
        data: {
          status: 200,
        },
      }
    }),
  }
})

jest.mock('queries/useGetBetaTestReview', () => ({
  useGetBetaTestReview: () => mockUseGetBetaTestReview(),
}))

const mockAxiosGet = jest.fn().mockImplementation(() => ({ status: 200 }))

jest.mock('axios', () => ({
  isAxiosError: () => true,
}))

const mockScrollTo = jest.fn()
global.scrollTo = mockScrollTo

const mockSubmitForm = jest.fn(() => Promise.resolve())
const mockUseFormikContext = jest.fn().mockImplementation(() => ({
  submitCount: 0,
}))
jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  useFormikContext: () => mockUseFormikContext(),
}))

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('queries/useSaveCompleteClaim')
const mockUseSaveCompleteClaim = useSaveCompleteClaim as jest.Mock

jest.mock('queries/useSubmitClaim')
const mockUseSubmitClaim = useSubmitClaim as jest.Mock

describe('Review page', () => {
  const claimFormContext: ClaimFormContextType = {
    claimFormValues: {
      claimant_name: {
        first_name: 'someone with',
        middle_initial: 'a',
        last_name: 'name',
        suffix: '',
      },
    },
    setClaimFormValues: jest.fn(),
  }

  const renderReview = () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ClaimFormContext.Provider value={claimFormContext}>
          <Review />
        </ClaimFormContext.Provider>
      </QueryClientProvider>
    )

    const preamble = screen.getByText('preamble.heading')
    const backButton = screen.getByRole('button', {
      name: 'pagination.previous',
    })
    const submitButton = screen.getByRole('button', {
      name: 'pagination.submit',
    })

    const queryForErrorMessage = () =>
      screen.queryByText('complete_claim_error')
    const queryForErrorMessageList = () => screen.queryByTestId('error-list')
    return {
      preamble,
      backButton,
      submitButton,
      queryForErrorMessage,
      queryForErrorMessageList,
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders properly', async () => {
    const { preamble, backButton, submitButton } = renderReview()

    expect(preamble).toBeInTheDocument()
    expect(backButton).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('toggles fields conditionally', async () => {
    const user = userEvent.setup()

    render(
      <QueryClientProvider client={new QueryClient()}>
        <Review />
      </QueryClientProvider>
    )

    expect(screen.getByLabelText('certify.label')).toBeInTheDocument()

    await user.click(
      screen.getByRole('checkbox', {
        name: 'certify.label',
      })
    )

    expect(
      screen.getByRole('checkbox', {
        name: 'certify.label',
      })
    ).toBeChecked()
  })

  it('renders an error message if completing has failed', () => {
    mockUseSaveCompleteClaim.mockReturnValueOnce({
      isError: true,
      error: {
        response: {
          data: {
            message: 'I am a fake internal server error',
            errors: ['data line 1', '$.data with weird characters'],
          },
        },
      },
    })

    const { queryForErrorMessage, queryForErrorMessageList } = renderReview()
    const errorMessage = queryForErrorMessage()

    expect(errorMessage).toBeInTheDocument()
    expect(queryForErrorMessageList()).toBeInTheDocument()
    expect(screen.queryByText('data line 1')).toBeInTheDocument()
    expect(screen.queryByText('data with weird characters')).toBeInTheDocument()
  })

  it('renders the failure message for complete claim when response is just a string', () => {
    mockUseSaveCompleteClaim.mockReturnValueOnce({
      isError: true,
      error: {
        response: {
          data: {
            message: 'I am a fake internal server error',
          },
        },
      },
    })

    const { queryForErrorMessage, queryForErrorMessageList } = renderReview()
    const errorMessage = queryForErrorMessage()

    expect(errorMessage).toBeInTheDocument()
    expect(queryForErrorMessageList()).toBeInTheDocument()
    expect(
      screen.queryByText('I am a fake internal server error')
    ).toBeInTheDocument()
  })

  it('renders an error message if submission has failed', () => {
    mockUseSubmitClaim.mockReturnValueOnce({
      isError: true,
      error: {
        response: {
          data: 'API Response',
        },
      },
    })

    const { queryForErrorMessage } = renderReview()

    const errorMessage = queryForErrorMessage()
    const apiResponse = screen.queryByText('API Response')

    expect(errorMessage).toBeInTheDocument()
    expect(apiResponse).toBeInTheDocument()
  })

  it('submits the form when clicking the submit button and then navigates to the home page', async () => {
    const user = userEvent.setup()

    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      setSubmitting: jest.fn(),
      submitForm: mockSubmitForm,
    })

    const mockSaveCompleteClaimMutate = jest.fn((values, options) => {
      options.onSuccess()
    })
    mockUseSaveCompleteClaim.mockImplementation(() => ({
      mutate: (values: ClaimantInput, options: any) =>
        mockSaveCompleteClaimMutate(values, options),
    }))

    const mockSubmitClaimMutate = jest.fn((values, options) =>
      options.onSuccess()
    )
    mockUseSubmitClaim.mockImplementation(() => ({
      mutate: (values: ClaimantInput, options: any) =>
        mockSubmitClaimMutate(values, options),
    }))

    const { submitButton } = renderReview()

    await user.click(submitButton)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockSaveCompleteClaimMutate).toHaveBeenCalledTimes(1)
    expect(mockSaveCompleteClaimMutate).toHaveBeenCalledWith(
      claimFormContext.claimFormValues,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(mockSubmitClaimMutate).toHaveBeenCalledTimes(1)
    expect(mockSaveCompleteClaimMutate).toHaveBeenCalledWith(
      claimFormContext.claimFormValues,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(mockScrollTo).not.toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith({
      pathname: Routes.CLAIM.SUCCESS,
    })
  })

  it('does not complete or submit the claim if the form is invalid', async () => {
    const user = userEvent.setup()

    mockUseFormikContext.mockReturnValue({
      isValid: false,
      isSubmitting: false,
      submitForm: mockSubmitForm,
    })

    const mockSaveCompleteClaimMutate = jest.fn()
    mockUseSaveCompleteClaim.mockReturnValueOnce({
      mutate: mockSaveCompleteClaimMutate,
    })

    const mockSubmitClaimMutate = jest.fn()
    mockUseSubmitClaim.mockReturnValueOnce({
      mutate: mockSubmitClaimMutate,
    })

    const { submitButton } = renderReview()

    await user.click(submitButton)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockSaveCompleteClaimMutate).not.toHaveBeenCalled()
    expect(mockSubmitClaimMutate).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
    expect(mockScrollTo).not.toHaveBeenCalled()
  })

  it('does not submit the claim if the claim is not successfully completed', async () => {
    const user = userEvent.setup()

    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      setSubmitting: jest.fn(),
      submitForm: mockSubmitForm,
    })

    const mockSaveCompleteClaimMutate = jest.fn()
    mockUseSaveCompleteClaim.mockImplementation(() => ({
      mutate: mockSaveCompleteClaimMutate,
    }))

    const mockSubmitClaimMutate = jest.fn((values, options) =>
      options.onSuccess()
    )
    mockUseSubmitClaim.mockImplementation(() => ({
      mutate: (values: ClaimantInput, options: any) =>
        mockSubmitClaimMutate(values, options),
    }))

    const { submitButton } = renderReview()

    await user.click(submitButton)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockSaveCompleteClaimMutate).toHaveBeenCalledTimes(1)
    expect(mockSaveCompleteClaimMutate).toHaveBeenCalledWith(
      claimFormContext.claimFormValues,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(mockSubmitClaimMutate).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('does not navigate away if the claim is not successfully submitted to the persistence api', async () => {
    const user = userEvent.setup()

    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      setSubmitting: jest.fn(),
      submitForm: mockSubmitForm,
    })

    const mockSaveCompleteClaimMutate = jest.fn((values, options) => {
      options.onSuccess()
    })
    mockUseSaveCompleteClaim.mockImplementation(() => ({
      mutate: (values: ClaimantInput, options: any) =>
        mockSaveCompleteClaimMutate(values, options),
    }))

    const mockSubmitClaimMutate = jest.fn()
    mockUseSubmitClaim.mockImplementation(() => ({
      mutate: mockSubmitClaimMutate,
    }))

    const { submitButton } = renderReview()

    await user.click(submitButton)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockSaveCompleteClaimMutate).toHaveBeenCalledTimes(1)
    expect(mockSaveCompleteClaimMutate).toHaveBeenCalledWith(
      claimFormContext.claimFormValues,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(mockSubmitClaimMutate).toHaveBeenCalledTimes(1)
    expect(mockSubmitClaimMutate).toHaveBeenCalledWith(
      claimFormContext.claimFormValues,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(mockPush).not.toHaveBeenCalled()
  })

  describe('beta test functionality', () => {
    it('renders (and scrolls to) an error when the beta test submission fails', async () => {
      const user = userEvent.setup()

      mockUseFormikContext.mockReturnValue({
        isValid: true,
        isSubmitting: false,
        setSubmitting: jest.fn(),
        submitForm: mockSubmitForm,
      })

      const mockSaveCompleteClaimMutate = jest.fn((values, options) => {
        options.onSuccess()
      })
      mockUseSaveCompleteClaim.mockImplementation(() => ({
        mutate: (values: ClaimantInput, options: any) =>
          mockSaveCompleteClaimMutate(values, options),
      }))

      const serverErrorMessage =
        'A message from the server about what went wrong'

      mockAxiosGet.mockImplementation(() => {
        return {
          status: 500,
          response: {
            data: serverErrorMessage,
          },
        }
      })

      mockUseGetBetaTestReview.mockImplementation(() => {
        return {
          refetch: () => {
            return {
              error: {
                response: {
                  status: 500,
                  data: serverErrorMessage,
                },
              },
            }
          },
        }
      })

      const mockSubmitClaimMutate = jest.fn()
      mockUseSubmitClaim.mockImplementation(() => ({
        mutate: mockSubmitClaimMutate,
      }))

      const { submitButton, queryForErrorMessage } = renderReview()

      await user.click(submitButton)

      expect(mockSubmitForm).toHaveBeenCalledTimes(1)
      expect(mockSaveCompleteClaimMutate).toHaveBeenCalledTimes(1)
      expect(mockSaveCompleteClaimMutate).toHaveBeenCalledWith(
        claimFormContext.claimFormValues,
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
      expect(mockSubmitClaimMutate).toHaveBeenCalledTimes(0)
      expect(mockPush).not.toHaveBeenCalled()
      expect(mockScrollTo).toHaveBeenCalledTimes(1)
      expect(queryForErrorMessage()).toBeInTheDocument()
      expect(screen.queryByText(serverErrorMessage)).toBeInTheDocument()
    })

    it('renders (and scrolls to) save complete claim error', async () => {
      const user = userEvent.setup()

      mockUseFormikContext.mockReturnValue({
        isValid: true,
        isSubmitting: false,
        setSubmitting: jest.fn(),
        submitForm: mockSubmitForm,
      })

      const mockSaveCompleteClaimMutate = jest.fn((values, options) => {
        options.onError()
      })
      mockUseSaveCompleteClaim.mockImplementation(() => ({
        mutate: (values: ClaimantInput, options: any) =>
          mockSaveCompleteClaimMutate(values, options),
      }))

      const { submitButton } = renderReview()

      await user.click(submitButton)

      expect(mockScrollTo).toHaveBeenCalledTimes(1)
    })

    it('renders (and scrolls to) error on submit claim error', async () => {
      const user = userEvent.setup()

      mockUseFormikContext.mockReturnValue({
        isValid: true,
        isSubmitting: false,
        setSubmitting: jest.fn(),
        submitForm: mockSubmitForm,
      })

      const mockSaveCompleteClaimMutate = jest.fn((values, options) =>
        options.onSuccess()
      )
      mockUseSaveCompleteClaim.mockImplementation(() => ({
        mutate: (values: ClaimantInput, options: any) =>
          mockSaveCompleteClaimMutate(values, options),
      }))

      mockUseGetBetaTestReview.mockImplementation(() => {
        return {
          refetch: () => {
            return {
              data: {
                status: 200,
              },
            }
          },
        }
      })

      const mockSubmitClaimMutate = jest.fn((values, options) => {
        return options.onError()
      })
      mockUseSubmitClaim.mockImplementation(() => ({
        mutate: (values: ClaimantInput, options: any) =>
          mockSubmitClaimMutate(values, options),
      }))

      const { submitButton } = renderReview()

      await user.click(submitButton)

      expect(mockSubmitForm).toHaveBeenCalledTimes(1)
      expect(mockSaveCompleteClaimMutate).toHaveBeenCalledTimes(1)
      expect(mockSubmitClaimMutate).toHaveBeenCalledTimes(1)
      expect(mockScrollTo).toHaveBeenCalledTimes(1)
    })
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = Review
      expect(Page).toHaveProperty('getLayout')

      render(
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
