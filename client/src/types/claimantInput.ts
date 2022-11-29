import {
  EthnicityOption,
  RaceOption,
  SexOption,
  InterpreterTTYOption,
  PreferredLanguageOption,
  PaymentMethodOption,
  AccountTypeOption,
  DisabilityPaymentTypeOption,
  DisabilityTypeOption,
  AuthorizationTypeOption,
  EducationLevelOption,
  SuffixOption,
} from 'constants/formOptions'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ClaimantInput = ScreenerInput &
  PrequalInput &
  PersonalInput &
  ContactInput &
  DemographicsInput &
  IdentityInput &
  EmployerInput &
  // EmployerReviewInput &
  // OccupationInput &
  EducationAndTrainingInput &
  UnionInput &
  DisabilityStatusInput &
  PaymentInput &
  ReviewInput

export type EmployerInput = {
  employers?: Employer[]
}

export type Employer = {
  isImported?: boolean
  isEmployer?: boolean
  employer_address?: AddressInput
  employer_phone?: string

  isInitiated?: boolean
  name?: string
  isFullTime?: boolean

  separation_circumstance?: string
  expect_to_be_recalled?: boolean
  employment_start_date?: string
  employment_last_date?: string
  reason_still_employed?: string
  hours_reduced_twenty_percent?: boolean

  worked_at_employer_address?: boolean
  alternate_physical_work_address?: AddressWithoutStreetInput
  is_employer_phone_accurate?: boolean
  work_location_phone?: PhoneInput

  self_employed?: boolean
  is_owner?: boolean
  corporate_officer_or_stock_ownership?: boolean
  employer_is_sole_proprietorship?: boolean
  related_to_owner_or_child_of_owner_under_18?: boolean
}

export type ScreenerInput = {
  screener_current_country_us?: boolean
  screener_live_in_canada?: boolean
  screener_job_last_eighteen_months?: boolean
  screener_all_work_nj?: boolean
  screener_any_work_nj?: boolean
  screener_currently_disabled?: boolean
  screener_military_service_eighteen_months?: boolean
  screener_maritime_employer_eighteen_months?: boolean
}

export type PrequalInput = {
  filed_in_last_12mo?: boolean
  state_province_territory_where_filed?: string
  lived_outside_nj_when_working_nj?: boolean
  will_look_for_work_in_nj?: boolean
  can_begin_work_immediately?: boolean
  federal_work_in_last_18mo?: boolean
}

type DemographicsInput = {
  sex?: SexOption
  ethnicity?: EthnicityOption
  race?: RaceOption[]
  education_level?: EducationLevelOption
}

type ContactInput = {
  email?: string
  claimant_phone?: PhoneInput
  alternate_phone?: PhoneInput
  interpreter_required?: InterpreterTTYOption
  preferred_language?: PreferredLanguageOption
  preferred_language_other?: string
}

export type PhoneInput = {
  number?: string
  sms?: boolean
}

type UnionInput = {
  union_name?: string
  union_local_number?: string
  required_to_seek_work_through_hiring_hall?: boolean
}

type DisabilityStatusInput = {
  disability_applied_to_or_received?: DisabilityPaymentTypeOption[]
  disabled_immediately_before?: boolean
  type_of_disability?: DisabilityTypeOption
  date_disability_began?: string
  recovery_date?: string
  contacted_last_employer_after_recovery?: boolean
}

type PaymentInput = {
  federal_income_tax_withheld?: boolean
  payment_method?: PaymentMethodOption
  account_type?: AccountTypeOption
  routing_number?: string
  LOCAL_re_enter_routing_number?: string
  account_number?: string
  LOCAL_re_enter_account_number?: string
  acknowledge_direct_deposit_option?: boolean
  apply_for_increased_payment_for_dependents?: boolean
}

type PersonalInput = ClaimantNameInput & ClaimantAddressInput

export type PersonNameInput = {
  first_name?: string
  middle_initial?: string
  last_name?: string
  suffix?: SuffixOption
}

export type AddressInput = {
  address: string
  city: string
  state: string
  zipcode: string
}

export type AddressWithoutStreetInput = {
  city: string
  state: string
  zipcode: string
}

type ClaimantAddressInput = {
  residence_address?: AddressInput
  mailing_address?: AddressInput
  LOCAL_mailing_address_same?: boolean
}

export type ClaimantNameInput = {
  claimant_name?: PersonNameInput
  LOCAL_claimant_has_alternate_names?: boolean
  alternate_names?: PersonNameInput[]
}

type IdentityInput = {
  birthdate?: string
  ssn?: string
  authorized_to_work?: boolean
  not_authorized_to_work_explanation?: string
  authorization_type?: AuthorizationTypeOption
  alien_registration_number?: string
  drivers_license_or_state_id_number?: string
}

type EducationAndTrainingInput = Partial<{
  attending_college_or_job_training: boolean
  enrollment: boolean
}>

type ReviewInput = {
  certify?: boolean
}

export type WhoAmI = {
  firstName?: string
  lastName?: string
  middleInitial?: string
  birthdate?: string
  email?: string
  phone?: string
}
