import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'

import ScreenerComponent from 'pages/screener'
import { Routes } from 'constants/routes'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import {
  IntakeAppContext,
  IntakeAppContextType,
} from 'contexts/IntakeAppContext'
import { ScreenerInput } from 'types/claimantInput'

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
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

describe('Screener page', () => {
  beforeEach(() => {
    const emptyPartialClaim = {}
    mockUseGetPartialClaim.mockImplementation(() => ({
      isLoading: false,
      data: emptyPartialClaim,
    }))
    mockAppendAndSaveClaimFormValues.mockClear()
  })

  const Screener = () => {
    return (
      <QueryClientProvider client={new QueryClient()}>
        <ScreenerComponent />
      </QueryClientProvider>
    )
  }

  const canUseFormValues: ScreenerInput = {
    screener_current_country_us: true,
    screener_live_in_canada: null,
    screener_job_last_eighteen_months: true,
    screener_all_work_nj: true,
    screener_any_work_nj: null,
    screener_currently_disabled: false,
    screener_military_service_eighteen_months: false,
    screener_federal_work_in_last_eighteen_months: false,
    screener_maritime_employer_eighteen_months: false,
  }

  const fillScreenerFields = async (
    user: UserEvent,
    formValues: { [key: string]: boolean | null }
  ) => {
    for (const k of Object.keys(formValues)) {
      if (formValues[`${k}`] !== null) {
        await user.click(
          within(
            screen.getByRole('group', { name: `${k}.label` })
          ).getByLabelText(formValues[`${k}`] === true ? 'yes' : 'no')
        )
      }
    }
  }

  it('renders properly', () => {
    render(<Screener />)

    expect(
      screen.getByText('screener_current_country_us.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_military_service_eighteen_months.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_job_last_eighteen_months.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_currently_disabled.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_federal_work_in_last_eighteen_months.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_maritime_employer_eighteen_months.label')
    ).toBeInTheDocument()

    const previousButton = screen.getByRole('button', {
      name: 'pagination.previous',
    })
    const nextButton = screen.getByRole('button', { name: 'pagination.next' })

    expect(previousButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('clicking back navigates properly', async () => {
    const user = userEvent.setup()
    render(<Screener />)

    const previousButton = screen.getByText('pagination.previous')

    await user.click(previousButton)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(Routes.SSN)
  })

  it('Can fill out all questions on page', async () => {
    const user = userEvent.setup()
    render(<Screener />)

    expect(
      screen.getByText('screener_current_country_us.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_live_in_canada.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_live_in_canada.label' })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_military_service_eighteen_months.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_military_service_eighteen_months.label',
        })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_job_last_eighteen_months.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_job_last_eighteen_months.label',
        })
      ).getByLabelText('yes')
    )

    expect(screen.getByText('screener_all_work_nj.label')).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_all_work_nj.label' })
      ).getByLabelText('no')
    )

    expect(screen.getByText('screener_any_work_nj.label')).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_any_work_nj.label',
        })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_currently_disabled.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_currently_disabled.label',
        })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_federal_work_in_last_eighteen_months.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_federal_work_in_last_eighteen_months.label',
        })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_maritime_employer_eighteen_months.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_maritime_employer_eighteen_months.label',
        })
      ).getByLabelText('no')
    )
  })

  it('Tests if Canada question clears', async () => {
    const user = userEvent.setup()
    render(<Screener />)

    expect(
      screen.getByText('screener_current_country_us.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_live_in_canada.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_live_in_canada.label' })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('no')
    )

    expect(screen.getByText('screener_live_in_canada.label')).not.toBeChecked()
  })

  it('Tests if Any and All Work in NJ questions clear', async () => {
    const user = userEvent.setup()
    render(<Screener />)

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_military_service_eighteen_months.label',
        })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_job_last_eighteen_months.label',
        })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_all_work_nj.label' })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_any_work_nj.label',
        })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_job_last_eighteen_months.label',
        })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_job_last_eighteen_months.label',
        })
      ).getByLabelText('yes')
    )

    expect(screen.getByText('screener_all_work_nj.label')).not.toBeChecked()

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_all_work_nj.label' })
      ).getByLabelText('no')
    )

    expect(screen.getByText('screener_any_work_nj.label')).not.toBeChecked()
  })

  describe('sets the correct context values', () => {
    const mockAppContext: IntakeAppContextType = {
      screenerInput: undefined,
      setScreenerInput: jest.fn(),
      setSsn: jest.fn(),
    }

    const testSubmitWithValues = async (disqualifyingValues: {
      [key: string]: boolean
    }) => {
      const user = userEvent.setup()

      render(
        <IntakeAppContext.Provider value={mockAppContext}>
          <Screener />
        </IntakeAppContext.Provider>
      )

      const formValues: { [key: string]: boolean | null } = {
        ...canUseFormValues,
        ...disqualifyingValues,
      }
      await fillScreenerFields(user, formValues)

      await user.click(screen.getByRole('button', { name: /next/i }))
      expect(mockAppContext.setScreenerInput).toHaveBeenCalledWith(formValues)
      expect(mockPush).toHaveBeenCalledWith(Routes.SCREENER_REDIRECT)
    }

    it('screener-redirect: when they say they are not in the US', async () => {
      const disqualifyingValues = {
        screener_current_country_us: false,
        screener_live_in_canada: true,
      }

      await testSubmitWithValues(disqualifyingValues)
    })

    it('screener-redirect:when no work was done in NJ', async () => {
      const disqualifyingValues = {
        screener_job_last_eighteen_months: true,
        screener_all_work_nj: false,
        screener_any_work_nj: false,
      }
      await testSubmitWithValues(disqualifyingValues)
    })
    it('screener-redirect:when they mark yes to having a disability', async () => {
      const disqualifyingValues = {
        screener_currently_disabled: true,
      }
      await testSubmitWithValues(disqualifyingValues)
    })
    it('screener-redirect:when they mark yes to military service', async () => {
      const disqualifyingValues = {
        screener_military_service_eighteen_months: true,
      }
      await testSubmitWithValues(disqualifyingValues)
    })
    it('screener-redirect:when they mark yes to federal work', async () => {
      const disqualifyingValues = {
        screener_federal_work_in_last_eighteen_months: true,
      }
      await testSubmitWithValues(disqualifyingValues)
    })
    it('screener-redirect:when they mark yes to maritime work', async () => {
      const disqualifyingValues = {
        screener_maritime_employer_eighteen_months: true,
      }
      await testSubmitWithValues(disqualifyingValues)
    })
    it('home page: when qualifying values are selected', async () => {
      const user = userEvent.setup()

      render(
        <IntakeAppContext.Provider value={mockAppContext}>
          <Screener />
        </IntakeAppContext.Provider>
      )

      await fillScreenerFields(user, canUseFormValues)

      await user.click(screen.getByRole('button', { name: /next/i }))
      expect(mockAppContext.setScreenerInput).toHaveBeenCalledWith(
        canUseFormValues
      )
      expect(mockPush).toHaveBeenCalledWith(Routes.CLAIM.PREQUAL)
    })
  })

  it('saves a claim with IntakeApp context values upon next', async () => {
    const user = userEvent.setup()

    const intakeAppContext = {
      setScreenerInput: jest.fn(),
      setSsn: jest.fn(),
      ssnInput: { ssn: '123' },
      screenerInput: undefined,
    }

    const formValues: { [key: string]: boolean | null } = {
      ...canUseFormValues,
    }

    const intakeAppValues = {
      ssn: '123',
      ...canUseFormValues,
    }

    render(
      <IntakeAppContext.Provider value={intakeAppContext}>
        <Screener />
      </IntakeAppContext.Provider>
    )

    await fillScreenerFields(user, formValues)

    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith(
      intakeAppValues
    )
  })
})
