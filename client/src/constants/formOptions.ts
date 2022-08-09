export const sexOptions = ['female', 'male', 'x'] as const
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

export const phoneTypeOptions = ['home', 'work', 'mobile'] as const
export type PhoneTypeOption = typeof phoneTypeOptions[number]

export const paymentMethodOptions = ['debit', 'direct_deposit'] as const
export type PaymentMethodOption = typeof paymentMethodOptions[number]

export const accountTypeOptions = ['checking', 'savings'] as const
export type AccountTypeOption = typeof accountTypeOptions[number]

export const authorizationTypeOptions = [
  'US_citizen_or_national',
  'permanent_resident',
  'temporary_legal_worker',
] as const
export type AuthorizationTypeOption = typeof authorizationTypeOptions[number]

export const disabilityTypeOptions = [
  'state_plan',
  'private_plan',
  'workers_compensation',
] as const
export type DisabilityTypeOption = typeof disabilityTypeOptions[number]

export const educationLevelOptions = [
  'none',
  'primary_school',
  'some_high_school',
  'high_school_ged',
  'technical_associates',
  'bachelors',
  'masters',
  'doctorate',
  'other',
] as const

export type EducationLevelOption = typeof educationLevelOptions[number]

export const enrollmentOptions = [
  'self_enrolled',
  'career_center',
  'union',
] as const

export type EnrollmentOption = typeof enrollmentOptions[number]
