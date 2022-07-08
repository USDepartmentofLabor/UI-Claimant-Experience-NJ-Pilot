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
