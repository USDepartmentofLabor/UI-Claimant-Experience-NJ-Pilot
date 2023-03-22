import { waitFor, screen, render, within } from '@testing-library/react'
import RecentEmployers from 'pages/claim/recent-employers'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Routes } from 'constants/routes'
import { WgpmEmployer } from 'utils/employer/employerUtils'
import { useGetRecentEmployers } from 'queries/useGetRecentEmployers'
import { WrappingProviders } from 'utils/testUtils'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')
jest.mock('queries/useGetRecentEmployers')

type statusType = number

type ResponseType = {
  status?: statusType
}
type ErrorResponseType = {
  response?: ResponseType
}
const mockUseGetRecentEmployers = useGetRecentEmployers as jest.Mock

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockAppendAndSaveClaimFormValues = jest.fn(() => Promise.resolve())
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    appendAndSaveClaimFormValues: mockAppendAndSaveClaimFormValues,
  }),
}))

const mockCognitoSignOut = jest.fn(() => Promise.resolve())
jest.mock('utils/signout/cognitoSignOut', () => ({
  cognitoSignOut: () => mockCognitoSignOut(),
}))

afterEach(() => jest.clearAllMocks())

describe('Recent employers page', () => {
  const renderRecentEmployers = (hookReturn?: {
    isLoading: boolean
    isError: boolean
    error?: ErrorResponseType
    data: WgpmEmployer[]
  }) => {
    if (hookReturn) {
      mockUseGetRecentEmployers.mockReturnValue(hookReturn)
    }

    render(
      <QueryClientProvider client={new QueryClient()}>
        <RecentEmployers />
      </QueryClientProvider>
    )
  }

  it('renders properly without error', async () => {
    renderRecentEmployers()
    expect(screen.getByText('recent_employers.preamble')).toBeInTheDocument()
    expect(screen.getByText('recent_employers.question')).toBeInTheDocument()

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Microsoft')).toBeInTheDocument()
    expect(screen.getByText('Wendys')).toBeInTheDocument()
    expect(screen.getByText('PLAIN OLE CLOTHES, INC.')).toBeInTheDocument()

    const employer = await screen
      .findAllByRole('group', {
        name: /recent_employers.work_at/,
      })
      .then((value) => value[0])
    expect(employer).toBeInTheDocument()

    expect(within(employer).queryByLabelText('yes')).toBeInTheDocument()
    expect(within(employer).queryByLabelText('no')).toBeInTheDocument()
  })

  it('displays an alert when user selects that they did not work for an employer', async () => {
    renderRecentEmployers()
    const user = userEvent.setup()
    expect(
      screen.queryByText('recent_employers.confirm_employer')
    ).not.toBeInTheDocument()

    const employerOne = await screen
      .findAllByRole('group', {
        name: /recent_employers.work_at/,
      })
      .then((value) => value[0])
    const employerOneRadioNo = within(employerOne).getByLabelText('no')
    await user.click(employerOneRadioNo)
    expect(employerOneRadioNo).toBeChecked()

    expect(
      screen.queryByText('recent_employers.confirm_employer')
    ).toBeInTheDocument()
  })
  it('next page goes to edit employer page if worked for imported employer', async () => {
    const user = userEvent.setup()
    renderRecentEmployers()

    const [firstEmployerYes] = screen.getAllByRole('radio', { name: 'yes' })
    await user.click(firstEmployerYes)

    const [, secondEmployerNo] = screen.getAllByRole('radio', { name: 'no' })
    await user.click(secondEmployerNo)

    const [, , thirdEmployerNo] = screen.getAllByRole('radio', { name: 'no' })
    await user.click(thirdEmployerNo)

    const [, , , fourthEmployerNo] = screen.getAllByRole('radio', {
      name: 'no',
    })
    await user.click(fourthEmployerNo)

    const nextButton = screen.getByRole('button', {
      name: 'pagination.next',
    })

    expect(firstEmployerYes).toBeChecked()
    await user.click(nextButton)
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(`${Routes.CLAIM.EDIT_EMPLOYER}/0`)
  })

  it('calls save handler on click of back button', async () => {
    renderRecentEmployers()
    const backButton = screen.getByRole('button', {
      name: 'pagination.previous',
    })
    await backButton.click()
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
  })

  it('calls save handler on click of next button', async () => {
    renderRecentEmployers()
    const nextButton = screen.getByRole('button', {
      name: 'pagination.previous',
    })
    await nextButton.click()
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalled()
  })

  it('calls save and exit handler with corresponding button click', async () => {
    renderRecentEmployers()

    const saveAndExitButton = screen.getByRole('button', {
      name: 'pagination.save_and_exit',
    })
    await saveAndExitButton.click()
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(mockCognitoSignOut).toHaveBeenCalledTimes(1))
  })
  it('shows the loader when page is loading', async () => {
    renderRecentEmployers({
      isLoading: true,
      isError: false,
      error: undefined,
      data: [],
    })
    expect(screen.getByTestId('page-loading')).toBeInTheDocument()
  })

  it('shows error when api call fails', async () => {
    renderRecentEmployers({
      isLoading: false,
      isError: true,
      error: { response: { status: 500 } },
      data: [],
    })
    expect(screen.getByText('errorStatus.500.')).toBeInTheDocument()
  })

  it('redirects to ssn on 400 error', async () => {
    renderRecentEmployers({
      isLoading: false,
      isError: true,
      error: { response: { status: 400 } },
      data: [],
    })
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(`${Routes.SSN}`)
  })

  it('shows wgpm warning box when WGPM call fails', async () => {
    renderRecentEmployers({
      isLoading: false,
      isError: true,
      error: { response: { status: 503 } },
      data: [],
    })
    expect(
      screen.queryByText('recent_employers.employer_retrieval_warning.heading')
    ).toBeInTheDocument()
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = RecentEmployers
      expect(Page).toHaveProperty('getLayout')

      render(
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
