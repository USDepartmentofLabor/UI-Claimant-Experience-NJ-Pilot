import {
  EthnicityOption,
  RaceOption,
  SexOption,
  InterpreterTTYOption,
  PayTypeOption,
  PreferredLanguageOption,
  PaymentMethodOption,
  AccountTypeOption,
  DisabilityPaymentTypeOption,
  DisabilityTypeOption,
  AuthorizationTypeOption,
  EducationLevelOption,
  SuffixOption,
  CountryOfOriginOption,
} from 'constants/formOptions'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ClaimantInput = ScreenerInput &
  SsnInput &
  PrequalInput &
  PersonalInput &
  ContactInput &
  DemographicsInput &
  IdentityInput &
  EmployerInput &
  ReviewEmployersInput &
  OccupationInput &
  EducationAndTrainingInput &
  UnionInput &
  DisabilityStatusInput &
  PaymentInput &
  ReviewInput

export type EmployerInput = {
  employers?: Employer[]
}

export type ImportedEmployerAddress = {
  employerAddressLine1: string | null
  employerAddressLine2: string | null
  employerAddressLine3: string | null
  employerAddressLine4: string | null
  employerAddressLine5: string | null
  employerAddressZip: string | null
}

export type ImportedEmployerFields = {
  is_imported?: boolean
  imported_address?: ImportedEmployerAddress
  worked_for_imported_employer_in_last_18mo?: boolean
}

export type Employer = ImportedEmployerFields & {
  employer_address?: EmployerAddressInput
  employer_phone?: PhoneInput

  isInitiated?: boolean
  fein?: string
  employer_name?: string
  is_full_time?: boolean

  separation_circumstance?: string
  expect_to_be_recalled?: boolean
  separation_circumstance_details?: string
  employment_start_date?: string
  employment_last_date?: string
  reason_still_employed?: string
  hours_reduced_twenty_percent?: boolean
  discharge_date?: string
  definite_recall?: boolean
  definite_recall_date?: string
  is_seasonal_work?: boolean

  worked_at_employer_address?: boolean
  alternate_physical_work_address?: AddressWithoutStreetInput
  is_employer_phone_accurate?: boolean
  work_location_phone?: PhoneInput

  self_employed?: boolean
  is_owner?: boolean
  corporate_officer_or_stock_ownership?: boolean
  employer_is_sole_proprietorship?: boolean
  related_to_owner_or_child_of_owner_under_18?: boolean //this seems wrong, how does this work???....

  LOCAL_pay_types: PayTypeOption[]
  payments_received: PaymentsReceivedDetailInput[]
}

export type ReviewEmployersInput = {
  LOCAL_reviewed_employers?: boolean
}

export type PaymentsReceivedDetailInput = {
  pay_type: PayTypeOption
  note?: string
  total?: string
  date_pay_began?: string
  date_pay_ended?: string
}

export type ScreenerInput = {
  screener_current_country_us?: boolean
  screener_live_in_canada?: boolean
  screener_job_last_eighteen_months?: boolean
  screener_all_work_nj?: boolean
  screener_any_work_nj?: boolean
  screener_military_service_eighteen_months?: boolean
  screener_currently_disabled?: boolean
  screener_federal_work_in_last_eighteen_months?: boolean
  screener_maritime_employer_eighteen_months?: boolean
}

export type SsnInput = {
  ssn?: string
}

export type PrequalInput = {
  filed_in_last_12mo?: boolean
  state_province_territory_where_filed?: string
  lived_outside_nj_when_working_nj?: boolean
  will_look_for_work_in_nj?: boolean
  can_begin_work_immediately?: boolean
}

export type DemographicsInput = {
  sex?: SexOption
  ethnicity?: EthnicityOption
  race?: RaceOption[]
  education_level?: EducationLevelOption
}

export type ContactInput = {
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

export type UnionInput = {
  union_name?: string
  union_local_number?: string
  required_to_seek_work_through_hiring_hall?: boolean
}

export type DisabilityStatusInput = {
  disability_applied_to_or_received?: DisabilityPaymentTypeOption[]
  disabled_immediately_before?: boolean
  type_of_disability?: DisabilityTypeOption
  date_disability_began?: string
  recovery_date?: string
  contacted_last_employer_after_recovery?: boolean
}

export type PaymentInput = {
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

export type PersonalInput = ClaimantNameInput & ClaimantAddressInput

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

export type EmployerAddressInput = {
  address: string
  address2?: string
  address3?: string
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

export type IdentityInput = {
  ssn?: string
  birthdate?: string
  has_nj_issued_id?: boolean
  drivers_license_or_state_id_number?: string
  authorization_type?: AuthorizationTypeOption
  employment_authorization_document_name?: PersonNameInput
  alien_registration_number?: string
  LOCAL_re_enter_alien_registration_number?: string
  country_of_origin?: CountryOfOriginOption
  employment_authorization_start_date?: string
  employment_authorization_end_date?: string
}

export type OccupationInput = {
  job_title?: string
  job_discription?: string
}

export type EducationAndTrainingInput = Partial<{
  attending_college_or_job_training: boolean
  training_through_hiring_hall_or_career_center: boolean
}>

export type ReviewInput = {
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
