import { screen, render, within } from '@testing-library/react'
import RecentEmployers from '../../../pages/claim/recent-employers'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Recent employers page', () => {
  it('renders properly without error', async () => {
    render(<RecentEmployers />)
    expect(screen.getByText('recent_employers.preamble')).toBeInTheDocument()
    expect(screen.getByText('recent_employers.question')).toBeInTheDocument()

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Microsoft')).toBeInTheDocument()
    expect(screen.getByText('Wendys')).toBeInTheDocument()

    //const employer = screen.getByText(/did you work at Apple/i)
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
    render(<RecentEmployers />)
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
