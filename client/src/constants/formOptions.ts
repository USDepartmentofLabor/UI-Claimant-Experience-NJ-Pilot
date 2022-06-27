export const sexOptions = ['female', 'male', 'x'] as const
export type SexOptionType = typeof sexOptions

export const ethnicityOptions = ['hispanic', 'not_hispanic', 'opt_out'] as const
export type EthnicityOptionType = typeof ethnicityOptions[number]

export const raceOptions = [
  'american_indian_or_alaskan',
  'asian',
  'black',
  'hawaiian_or_pacific_islander',
  'white',
  'opt_out',
] as const
export type RaceOptionType = typeof raceOptions[number]

export const typeOfPhoneOptions = ['home', 'work', 'mobile'] as const
export type TypeOfPhoneType = typeof typeOfPhoneOptions[number]
