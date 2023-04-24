import { ScreenerInput } from 'types/claimantInput'
import { getScreenerScenario } from './getScreenerScenario'

const buildScreenerInput = (): ScreenerInput => ({
  screener_current_country_us: null,
  screener_live_in_canada: null,
  screener_job_last_eighteen_months: null,
  screener_work_nj: 'nj',
  screener_military_service_eighteen_months: null,
  screener_currently_disabled: null,
  screener_federal_work_in_last_eighteen_months: null,
  screener_maritime_employer_eighteen_months: null,
})

describe('getScreenerScenario', () => {
  it('determines ineligibility if outside US and Canada', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: false,
      screener_live_in_canada: false,
    }
    const scenario = getScreenerScenario(input)

    expect(scenario).toEqual('INELIGIBLE_OUTSIDE_US_CANADA')
  })

  it('determines ineligibility if outside of New Jersey', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: true,
      screener_work_nj: 'other',
    }
    const scenario = getScreenerScenario(input)

    expect(scenario).toEqual('INELIGIBLE_WORK_OUTSIDE_NJ')
  })

  it('determines ineligibility if there is a disability', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: true,
      screener_work_nj: 'nj',
      screener_currently_disabled: true,
    }
    const scenario = getScreenerScenario(input)

    expect(scenario).toEqual('DISABILITY')
  })

  it('determines eligibility if there is a disability and skipDisabilityScenario is true', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: true,
      screener_work_nj: 'nj',
      screener_currently_disabled: true,
    }
    const scenario = getScreenerScenario(input, {
      skipDisabilityScenario: true,
    })

    expect(scenario).toEqual('NEW_FORM')
  })

  it('determines ineligibility if screener needs to call Canadian number', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: false,
      screener_work_nj: 'nj',
      screener_currently_disabled: false,
      screener_live_in_canada: true,
    }
    const scenario = getScreenerScenario(input)

    expect(scenario).toEqual('CANADA_CALL')
  })

  it('determines ineligibility if screener needs to call due to Maritime status', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: true,
      screener_work_nj: 'nj',
      screener_currently_disabled: false,
      screener_live_in_canada: false,
      screener_maritime_employer_eighteen_months: true,
    }
    const scenario = getScreenerScenario(input)

    expect(scenario).toEqual('MARITIME_CALL')
  })

  it('determines ineligibility if screener is Military', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: true,
      screener_work_nj: 'nj',
      screener_currently_disabled: false,
      screener_live_in_canada: false,
      screener_maritime_employer_eighteen_months: false,
      screener_military_service_eighteen_months: true,
    }
    const scenario = getScreenerScenario(input)

    expect(scenario).toEqual('MILITARY')
  })

  it('determines eligibility if screener is federal employee', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: true,
      screener_work_nj: 'nj',
      screener_currently_disabled: false,
      screener_live_in_canada: false,
      screener_federal_work_in_last_eighteen_months: true,
    }
    const scenario = getScreenerScenario(input)

    expect(scenario).toEqual('FEDERAL_STANDARD_FORM')
  })

  it('determines eligibility if screener is federal employee', () => {
    const input: ScreenerInput = {
      ...buildScreenerInput(),
      screener_current_country_us: true,
      screener_work_nj: 'nj',
      screener_currently_disabled: false,
      screener_live_in_canada: false,
      screener_federal_work_in_last_eighteen_months: false,
    }
    const scenario = getScreenerScenario(input)

    expect(scenario).toEqual('NEW_FORM')
  })
})
