export const interpreterTTYOptions = [
  'interpreter',
  'tty',
  'no_interpreter_tty',
] as const
export type InterpreterTTYOption = typeof interpreterTTYOptions[number]

export const preferredLanguageOptions = [
  'mandarin',
  'spanish',
  'haitian',
  'polish',
  'portuguese',
  'russian',
  'vietnamese',
  'other',
] as const
export type PreferredLanguageOption = typeof preferredLanguageOptions[number]

export const sexOptions = ['female', 'male', 'unspecified'] as const
export type SexOption = typeof sexOptions[number]

export const ethnicityOptions = ['hispanic', 'not_hispanic', 'opt_out'] as const
export type EthnicityOption = typeof ethnicityOptions[number]

export const raceOptions = [
  'american_indian_or_alaskan',
  'asian',
  'black',
  'hawaiian_or_pacific_islander',
  'white',
  'opt_out',
] as const
export type RaceOption = typeof raceOptions[number]

export const paymentMethodOptions = ['direct_deposit', 'debit'] as const
export type PaymentMethodOption = typeof paymentMethodOptions[number]

export const accountTypeOptions = ['checking', 'savings'] as const
export type AccountTypeOption = typeof accountTypeOptions[number]

export const authorizationTypeOptions = [
  'US_citizen_or_national',
  'permanent_resident',
  'temporary_legal_worker',
] as const
export type AuthorizationTypeOption = typeof authorizationTypeOptions[number]

export const disabilityPaymentTypeOptions = [
  'disability',
  'family_leave',
  'social_security',
  'none',
] as const
export type DisabilityPaymentTypeOption =
  typeof disabilityPaymentTypeOptions[number]

export const disabilityTypeOptions = [
  'state_plan',
  'private_plan',
  'workers_compensation',
] as const
export type DisabilityTypeOption = typeof disabilityTypeOptions[number]

export const educationLevelOptions = [
  'none',
  'less_than_high_school',
  'some_high_school',
  'high_school_ged',
  'high_school_credential_certification',
  'associates',
  'some_college',
  'bachelors',
  'some_graduate',
  'masters',
  'doctorate',
] as const

export type EducationLevelOption = typeof educationLevelOptions[number]

export const enrollmentOptions = [
  'self_enrolled',
  'career_center',
  'union',
] as const

export type EnrollmentOption = typeof enrollmentOptions[number]

export const suffixOptions = [
  'I',
  'II',
  'III',
  'IV',
  'junior',
  'senior',
] as const
export type SuffixOption = typeof suffixOptions[number]

export const changeInEmploymentOptions = [
  'laid_off',
  'fired_discharged_suspended',
  'unsatisfactory_work_performance',
  'quit_or_retired',
  'still_employed',
  'strike_or_lock_out_by_employer',
  // 'federal_or_state_shutdown',
] as const
export type ChangeInEmploymentOption = typeof changeInEmploymentOptions[number]

export const reasonStillEmployedOptions = [
  'reduction_in_hours_by_employer',
  'reduction_in_hours_by_claimant',
  'hours_not_reduced_at_this_employer',
  'leave_of_absence',
  'paid_vacation_holiday_or_pto',
  'temp_lay_off_or_furlough',
  'school_employee_on_break',
  'self_employed',
  'shared_work_program',
] as const
export type ReasonStillEmployedOptions =
  typeof reasonStillEmployedOptions[number]

export const employerRelationOptions = [
  'no',
  'spouse',
  'parent',
  'child',
] as const
export type EmployerRelationOption = typeof employerRelationOptions[number]

export const payTypeOptions = [
  'vacation_sick_pto',
  'final_paycheck',
  'pension_annuity_retirement',
  'severance_or_continuation',
  'other_pay',
  'none',
] as const
export type PayTypeOption = typeof payTypeOptions[number]
