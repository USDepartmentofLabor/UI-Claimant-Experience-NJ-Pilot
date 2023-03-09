import { render, screen } from '@testing-library/react'
import { ScreenerReview } from './ScreenerReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { WorkOption } from 'constants/formOptions'

describe('ScreenerReview component', () => {
  const renderScreenerReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <ScreenerReview />
      </ClaimFormContext.Provider>
    )

    const currentCountryUS = screen.queryAllByRole('group', {
      name: 'screener_current_country_us.label',
    })
    const liveInCanada = screen.queryAllByRole('group', {
      name: 'screener_live_in_canada.label',
    })
    const jobLastEighteenMonths = screen.queryAllByRole('group', {
      name: 'screener_job_last_eighteen_months.label',
    })
    const militaryServiceLastEighteenMonths = screen.queryAllByRole('group', {
      name: 'screener_military_service_eighteen_months.label',
    })
    const workNJ = screen.queryAllByRole('group', {
      name: 'screener_work_nj.label',
    })
    const currentlyDisabled = screen.queryAllByRole('group', {
      name: 'screener_currently_disabled.label',
    })
    const federalWorkLastEighteenMonths = screen.queryAllByRole('group', {
      name: 'screener_federal_work_in_last_eighteen_months.label',
    })
    const maritimeLastEighteenMonths = screen.queryAllByRole('group', {
      name: 'screener_maritime_employer_eighteen_months.label',
    })

    return {
      currentCountryUS,
      liveInCanada,
      jobLastEighteenMonths,
      militaryServiceLastEighteenMonths,
      workNJ,
      currentlyDisabled,
      federalWorkLastEighteenMonths,
      maritimeLastEighteenMonths,
    }
  }

  it('renders correctly', () => {
    const values = {
      screener_current_country_us: true,
      screener_live_in_canada: undefined,
      screener_job_last_eighteen_months: true,
      screener_military_service_eighteen_months: false,
      screener_work_nj: 'nj' as WorkOption,
      screener_currently_disabled: false,
      screener_federal_work_in_last_eighteen_months: false,
      screener_maritime_employer_eighteen_months: false,
    }

    const {
      currentCountryUS,
      jobLastEighteenMonths,
      militaryServiceLastEighteenMonths,
      workNJ,
      currentlyDisabled,
      federalWorkLastEighteenMonths,
      maritimeLastEighteenMonths,
    } = renderScreenerReview(values)

    expect(currentCountryUS[0]).toHaveTextContent('yes')
    expect(jobLastEighteenMonths[0]).toHaveTextContent('yes')
    expect(militaryServiceLastEighteenMonths[0]).toHaveTextContent('no')
    expect(workNJ[0]).toHaveTextContent(
      'screener_work_nj.labelscreener_work_nj.options.nj'
    )
    expect(currentlyDisabled[0]).toHaveTextContent('no')
    expect(federalWorkLastEighteenMonths[0]).toHaveTextContent('no')
    expect(maritimeLastEighteenMonths[0]).toHaveTextContent('no')
  })
})
