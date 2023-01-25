import { render, screen, within } from '@testing-library/react'
import { Prequal } from 'pages/claim/prequal'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'
import { IntakeAppContext } from 'contexts/IntakeAppContext'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')

const mockPush = jest.fn(async () => true)
const mockUseRouter = jest.fn(() => ({
  push: mockPush,
}))
jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter,
}))

const mockUseGetPartialClaim = jest.fn()
jest.mock('queries/useGetPartialClaim', () => ({
  useGetPartialClaim: () => mockUseGetPartialClaim(),
}))

const mockAppendAndSaveClaimFormValues = jest.fn(async () => Promise.resolve())
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    appendAndSaveClaimFormValues: mockAppendAndSaveClaimFormValues,
  }),
}))

describe('Prequal page', () => {
  beforeEach(() => {
    const emptyPartialClaim = {}
    mockUseGetPartialClaim.mockImplementation(() => ({
      isLoading: false,
      data: emptyPartialClaim,
    }))
    render(<Prequal />)
  })

  it('renders as expected', async () => {
    expect(screen.getByText('filed_in_last_12mo.label')).toBeInTheDocument()

    expect(
      screen.getByText('lived_outside_nj_when_working_nj.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('can_begin_work_immediately.label')
    ).toBeInTheDocument()
  })

  it('check clear state, province, and territory dropdown', async () => {
    const user = userEvent.setup()

    await user.click(
      within(
        screen.getByRole('group', { name: 'filed_in_last_12mo.label' })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('state_province_territory_where_filed.label')
    ).toBeInTheDocument()

    await user.click(
      within(
        screen.getByRole('group', { name: 'filed_in_last_12mo.label' })
      ).getByLabelText('no')
    )
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'filed_in_last_12mo.label',
        })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('state_province_territory_where_filed.label')
    ).toBeInTheDocument()
  })

  it('check clear "will look for work in NJ"', async () => {
    const user = userEvent.setup()

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'lived_outside_nj_when_working_nj.label',
        })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('will_look_for_work_in_nj.label')
    ).toBeInTheDocument()

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'lived_outside_nj_when_working_nj.label',
        })
      ).getByLabelText('no')
    )
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'lived_outside_nj_when_working_nj.label',
        })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('will_look_for_work_in_nj.label')
    ).toBeInTheDocument()
  })

  it('saves a claim with IntakeApp context values upon render', () => {
    const intakeAppContext = {
      setScreenerInput: jest.fn(),
      setSsn: jest.fn(),
      ssnInput: { ssn: '123' },
      screenerInput: { screener_job_last_eighteen_months: true },
    }

    const intakeAppValues = {
      ssn: '123',
      screener_job_last_eighteen_months: true,
    }

    render(
      <IntakeAppContext.Provider value={intakeAppContext}>
        <Prequal />
      </IntakeAppContext.Provider>
    )
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith(
      intakeAppValues
    )
  })

  it('can fill out all questions on page', async () => {
    const user = userEvent.setup()

    await user.click(
      within(
        screen.getByRole('group', { name: 'filed_in_last_12mo.label' })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('state_province_territory_where_filed.label')
    ).toBeInTheDocument()

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'lived_outside_nj_when_working_nj.label',
        })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('will_look_for_work_in_nj.label')
    ).toBeInTheDocument()

    await user.click(
      within(
        screen.getByRole('group', { name: 'will_look_for_work_in_nj.label' })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'can_begin_work_immediately.label' })
      ).getByLabelText('yes')
    )
  })

  describe('the error state', () => {
    beforeEach(() => {
      mockUseGetPartialClaim.mockImplementation(() => ({
        isLoading: false,
        isError: true,
      }))
    })
    it('renders a 500 error when loading finishes with an error', () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <Prequal />
        </QueryClientProvider>
      )

      const loader = screen.queryByTestId('page-loading')
      const errorDiv = screen.getByText('errorStatus.500.')

      expect(loader).not.toBeInTheDocument()
      expect(errorDiv).toBeInTheDocument()
    })
  })
})
