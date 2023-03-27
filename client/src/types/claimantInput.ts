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
  EmptyOption,
  UntouchedCheckboxValue,
  SolePropOption,
  ChangeInEmploymentOption,
  ReasonStillEmployedOption,
  UntouchedRadioValue,
  EmployerRelationOption,
  WorkOption,
} from 'constants/formOptions'

// Types here represent the possible values of the intake form fields.
// These are primarily informed by the type of the field (i.e YesNo, Text, Dropdown, Checkbox, Radio, etc) and the
// "initial value" state of the field.
// Formik (and React) is opinionated about preferring defined values be set for each field regardless of initial state.
// As a result, all fields (even if initially empty and/or hidden) are given initial values, typically corresponding to
// empty input, as follows:
// - Text inputs: empty strings represent empty input
// - Dropdowns: empty strings represent empty input
// - Checkboxes: empty strings represent empty input
// - Radio fields and "Yes/No" questions: null represents empty input

export type ClaimantInput = Partial<
  ScreenerInput &
    SsnInput &
    PrequalInput &
    IdentityInput &
    PersonalInput &
    AddressVerificationInput &
    ContactInput &
    DemographicsInput &
    EmployerInput &
    ReviewEmployersInput &
    OccupationInput &
    EducationAndTrainingInput &
    UnionInput &
    DisabilityStatusInput &
    PaymentInput &
    ReviewInput
>

export type YesNoInput = boolean | UntouchedRadioValue
export type CheckboxInput = boolean | UntouchedCheckboxValue

export type EmployerInput = {
  employers: Employer[]
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
  is_imported: boolean
  imported_address: ImportedEmployerAddress | null
  worked_for_imported_employer_in_last_18mo: YesNoInput
}

export type Employer = ImportedEmployerFields & {
  employer_address: EmployerAddressInput
  employer_phone: PhoneInput

  fein: string
  state_employer_payroll_number: string
  employer_name: string
  is_full_time: YesNoInput

  separation_circumstance: ChangeInEmploymentOption | UntouchedRadioValue
  expect_to_be_recalled: YesNoInput
  separation_circumstance_details: string
  employment_start_date: string
  employment_last_date: string
  reason_still_employed: ReasonStillEmployedOption | EmptyOption
  hours_reduced_twenty_percent: YesNoInput
  discharge_date: string
  definite_recall: YesNoInput
  definite_recall_date: string
  is_seasonal_work: YesNoInput

  worked_at_employer_address: YesNoInput
  alternate_physical_work_address: AddressWithoutStreetInput
  is_employer_phone_accurate: YesNoInput
  work_location_phone: PhoneInput

  self_employed: YesNoInput
  is_owner: YesNoInput
  corporate_officer_or_stock_ownership: YesNoInput
  employer_is_sole_proprietorship: SolePropOption | UntouchedRadioValue
  related_to_owner_or_child_of_owner_under_18:
    | EmployerRelationOption
    | UntouchedRadioValue

  LOCAL_pay_types: PayTypeOption[]
  payments_received: PaymentsReceivedDetailInput[]
}

export type ReviewEmployersInput = {
  LOCAL_reviewed_employers: boolean
}

export type PaymentsReceivedDetailInput = {
  pay_type: PayTypeOption
  note: string
  total: string
  date_pay_began: string
  date_pay_ended: string
}

export type ScreenerInput = {
  screener_current_country_us: YesNoInput
  screener_live_in_canada: YesNoInput
  screener_job_last_eighteen_months: YesNoInput
  screener_work_nj: WorkOption | UntouchedRadioValue
  screener_military_service_eighteen_months: YesNoInput
  screener_currently_disabled: YesNoInput
  screener_federal_work_in_last_eighteen_months: YesNoInput
  screener_maritime_employer_eighteen_months: YesNoInput
}

export type SsnInput = {
  ssn: string
}

export type PrequalInput = {
  filed_in_last_12mo: YesNoInput
  state_province_territory_where_filed: string // TODO: Not a string, but an enumerated list
  lived_outside_nj_when_working_nj: YesNoInput
  will_look_for_work_in_nj: YesNoInput
  can_begin_work_immediately: YesNoInput
}

export type DemographicsInput = {
  sex: SexOption | UntouchedRadioValue
  ethnicity: EthnicityOption | UntouchedRadioValue
  race: RaceOption[]
  education_level: EducationLevelOption | EmptyOption
}

export type ContactInput = {
  email: string
  claimant_phone: PhoneInput
  alternate_phone: PhoneInput
  interpreter_required: InterpreterTTYOption | UntouchedRadioValue
  preferred_language: PreferredLanguageOption | UntouchedRadioValue
  preferred_language_other: string
}

export type PhoneInput = {
  number: string
  sms: YesNoInput
}

export type UnionInput = {
  required_to_seek_work_through_hiring_hall: YesNoInput
  union_name: string
  union_local_number: string
}

export type DisabilityStatusInput = {
  disability_applied_to_or_received: DisabilityPaymentTypeOption[]
  disabled_immediately_before: YesNoInput
  type_of_disability: DisabilityTypeOption | UntouchedRadioValue
  date_disability_began: string
  recovery_date: string
  contacted_last_employer_after_recovery: YesNoInput
}

export type PaymentInput = {
  payment_method: PaymentMethodOption | UntouchedRadioValue
  account_type: AccountTypeOption | UntouchedRadioValue
  routing_number: string
  LOCAL_re_enter_routing_number: string
  account_number: string
  LOCAL_re_enter_account_number: string
  acknowledge_direct_deposit_option: CheckboxInput
  federal_income_tax_withheld: YesNoInput
  apply_for_increased_payment_for_dependents: YesNoInput
}

export type AddressVerificationInput = ClaimantAddressInput

export type PersonalInput = ClaimantNameInput & ClaimantAddressInput

export type PersonNameInput = {
  first_name: string
  middle_initial: string
  last_name: string
  suffix: SuffixOption | EmptyOption
}

export type AddressOption = {
  label: string
  value: string
  address: AddressInput
}

export type AddressInput = {
  address: string
  address2: string
  city: string
  state: string
  zipcode: string
}

export type EmployerAddressInput = {
  address: string
  address2: string
  address3: string
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
  residence_address: AddressInput
  mailing_address: AddressInput
  LOCAL_mailing_address_same: boolean // NOT CheckboxInput, because it starts false (is never null)
}

export type ClaimantNameInput = {
  claimant_name: PersonNameInput
  LOCAL_claimant_has_alternate_names: YesNoInput
  alternate_names: PersonNameInput[]
}

export type IdentityInput = {
  ssn: string
  birthdate: string
  has_nj_issued_id: YesNoInput
  drivers_license_or_state_id_number: string
  authorization_type: AuthorizationTypeOption | UntouchedRadioValue
  employment_authorization_document_name: PersonNameInput
  alien_registration_number: string
  LOCAL_re_enter_alien_registration_number: string
  country_of_origin: CountryOfOriginOption | EmptyOption
  employment_authorization_start_date: string
  employment_authorization_end_date: string
}

export type OccupationInput = {
  job_title: string
  job_description: string
}

export type EducationAndTrainingInput = {
  attending_college_or_job_training: YesNoInput
  training_through_hiring_hall_or_career_center: YesNoInput
}

export type ReviewInput = {
  certify: CheckboxInput
}

export type WhoAmI = {
  firstName?: string
  lastName?: string
  middleInitial?: string
  birthdate?: string
  email?: string
  phone?: string
}
