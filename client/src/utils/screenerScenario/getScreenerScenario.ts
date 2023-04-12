import { ScreenerInput } from 'types/claimantInput'

export type Scenario =
  | 'INELIGIBLE_OUTSIDE_US_CANADA'
  | 'INELIGIBLE_WORK_OUTSIDE_NJ'
  | 'DISABILITY'
  | 'CANADA_CALL'
  | 'MARITIME_CALL'
  | 'MILITARY'
  | 'FEDERAL_STANDARD_FORM'
  | 'NEW_FORM'

export const getScreenerScenario = ({
  screener_current_country_us,
  screener_live_in_canada,
  screener_work_nj,
  screener_military_service_eighteen_months,
  screener_currently_disabled,
  screener_federal_work_in_last_eighteen_months,
  screener_maritime_employer_eighteen_months,
}: Partial<ScreenerInput> = {}): Scenario => {
  if (!screener_current_country_us && !screener_live_in_canada) {
    return 'INELIGIBLE_OUTSIDE_US_CANADA'
  } else if (screener_work_nj === 'other') {
    return 'INELIGIBLE_WORK_OUTSIDE_NJ'
  } else if (screener_currently_disabled) {
    return 'DISABILITY'
  } else if (!screener_current_country_us && screener_live_in_canada) {
    return 'CANADA_CALL'
  } else if (
    screener_current_country_us &&
    screener_maritime_employer_eighteen_months
  ) {
    return 'MARITIME_CALL'
  } else if (
    screener_current_country_us &&
    screener_military_service_eighteen_months
  ) {
    return 'MILITARY'
  } else if (screener_federal_work_in_last_eighteen_months) {
    return 'FEDERAL_STANDARD_FORM'
  } else {
    return 'NEW_FORM'
  }
}
