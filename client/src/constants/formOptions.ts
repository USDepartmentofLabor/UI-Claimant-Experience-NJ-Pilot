export const workOptions = ['nj', 'other', 'both'] as const
export type WorkOption = typeof workOptions[number]

export const UNTOUCHED_RADIO_VALUE = null
export type UntouchedRadioValue = typeof UNTOUCHED_RADIO_VALUE

export const UNTOUCHED_CHECKBOX_VALUE = '' as const
export type UntouchedCheckboxValue = typeof UNTOUCHED_CHECKBOX_VALUE

export const EMPTY_DROPDOWN_OPTION = '' as const
export type EmptyOption = typeof EMPTY_DROPDOWN_OPTION

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
  'H1B_visa',
  'employment_authorization_or_card_or_doc',
  'not_legally_allowed_to_work_in_US',
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

export const suffixOptions = [
  'I',
  'II',
  'III',
  'IV',
  'junior',
  'senior',
] as const
export type SuffixOption = typeof suffixOptions[number]

export const solePropOptions = ['yes', 'no', 'not_sure'] as const
export type SolePropOption = typeof solePropOptions[number]

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
  'seasonal_work',
  'school_employee_on_break',
  'self_employed',
  'shared_work_program',
] as const
export type ReasonStillEmployedOption =
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
  'severance',
  'continuation',
  'payment_in_lieu_of_notice',
  'holiday',
  'other_pay',
  'none',
] as const
export type PayTypeOption = typeof payTypeOptions[number]

export const payTypesWithDates = [
  'continuation',
  'holiday',
  'payment_in_lieu_of_notice',
]

export const countryOfOriginOptions = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antigua & Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia & Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  "Cote d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Czechoslovakia',
  'Dem. Republic of Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'Former Rep of Macedonia',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guinea',
  'Guinea - Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong-Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea',
  'Kuwait',
  'Kyrgyzstan',
  "Lao People's Demo Republi",
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libyan ArabJamahiriya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherland Antilles',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Republic of Korea',
  'Republic of Moldova',
  'Reunion',
  'Romania',
  'Russian Federation',
  'Rwanda',
  'Saint Kitts & Nevis',
  'Saint Lucia',
  'Samoa',
  'San Marino',
  'Sao Tome & Principe',
  'Saudi Arabia',
  'Scotland',
  'Senegal',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'Spain',
  'Sri Lanka',
  'St. Helena',
  'St. Togo',
  'St. Vincent & Grenadines',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syrian Arab Republic',
  'Taiwan',
  'Tajikistan',
  'Thailand',
  'Tobago',
  'Tokelau',
  'Tonga',
  'Trinidad',
  'Trinidad & Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'UK Great Britain&N Irelan',
  'Ukraine',
  'United Arab Emirates',
  'United Republic Tanzania',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Viet Nam',
  'West Bank',
  'Western Sahara',
  'Yemen',
  'Yugoslavia',
  'Zaire',
  'Zambia',
  'Zimbabwe',
] as const

export type CountryOfOriginOption = typeof countryOfOriginOptions[number]
