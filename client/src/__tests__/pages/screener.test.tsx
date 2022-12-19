import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Screener from 'pages/screener'
import { Routes } from 'constants/routes'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import {
  IntakeAppContext,
  IntakeAppContextType,
} from 'contexts/IntakeAppContext'

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Screener page', () => {
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

    const canUseFormValues = {
      screener_current_country_us: true,
      screener_live_in_canada: undefined,
      screener_job_last_eighteen_months: true,
      screener_all_work_nj: true,
      screener_any_work_nj: undefined,
      screener_currently_disabled: false,
      screener_military_service_eighteen_months: false,
      screener_federal_work_in_last_eighteen_months: false,
      screener_maritime_employer_eighteen_months: false,
    }

    const fillScreenerFields = async (
      user: UserEvent,
      formValues: { [key: string]: boolean | undefined }
    ) => {
      for (const k of Object.keys(formValues)) {
        if (formValues[`${k}`] !== undefined) {
          await user.click(
            within(
              screen.getByRole('group', { name: `${k}.label` })
            ).getByLabelText(formValues[`${k}`] === true ? 'yes' : 'no')
          )
        }
      }
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

      const formValues: { [key: string]: boolean | undefined } = {
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
      expect(mockPush).toHaveBeenCalledWith(Routes.HOME)
    })
  })
})
