import { waitFor, screen, render, within } from '@testing-library/react'
import RecentEmployers from 'pages/claim/recent-employers'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Routes } from 'constants/routes'
import { WgpmEmployer } from 'utils/employer/employerUtils'
import { useGetRecentEmployers } from 'queries/useGetRecentEmployers'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')
jest.mock('queries/useGetRecentEmployers')
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
      data: [],
    })
    expect(screen.getByTestId('page-loading')).toBeInTheDocument()
  })

  it('shows error when api call fails', async () => {
    renderRecentEmployers({
      isLoading: false,
      isError: true,
      data: [],
    })
    expect(screen.getByText('errorStatus.500.')).toBeInTheDocument()
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = RecentEmployers
      expect(Page).toHaveProperty('getLayout')

      render(
        <QueryClientProvider client={new QueryClient()}>
          {Page.getLayout?.(<Page />)}
        </QueryClientProvider>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
