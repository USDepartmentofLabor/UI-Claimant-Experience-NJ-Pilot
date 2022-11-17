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
  'some_college',
  'associates',
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

export const employerRelationOptions = [
  'no',
  'spouse',
  'parent',
  'child',
] as const
export type EmployerRelationOption = typeof employerRelationOptions[number]
