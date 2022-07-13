import {
  EthnicityOption,
  RaceOption,
  SexOption,
  PhoneTypeOption,
  PaymentMethodOption,
  AccountTypeOption,
} from 'constants/formOptions'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ClaimantInput = PersonalInput &
  ContactInput &
  DemographicInput &
  // IdentityInput &
  // EmployerInput &
  // EmployerReviewInput &
  // SelfEmploymentInput &
  // OtherPayInput &
  // OccupationInput &
  // EducationVocationalRehabInput &
  UnionInput &
  // DisabilityInput &
  // AvailabilityInput &
  PaymentInput
// & ReviewInput

type DemographicInput = {
  sex?: SexOption
  ethnicity?: EthnicityOption
  race?: RaceOption[]
}

type ContactInput = {
  email?: string
  phones?: PhoneInput[]
  interpreter_required?: boolean
  preferred_language?: string
  LOCAL_more_phones?: boolean
}

export type PhoneInput = {
  number: string
  sms?: boolean
  type?: PhoneTypeOption
}

type UnionInput = {
  union?: {
    is_union_member?: boolean
    union_name?: string
    union_local_number?: string
    required_to_seek_work_through_hiring_hall?: boolean
  }
}

type PaymentInput = {
  federal_income_tax_withheld?: boolean
  payment?: {
    payment_method?: PaymentMethodOption
    account_type?: AccountTypeOption
    routing_number?: string
    LOCAL_re_enter_routing_number?: string
    account_number?: string
    LOCAL_re_enter_account_number?: string
  }
}

type PersonalInput = ClaimantNameInput & ClaimantAddressInput

export type PersonNameInput = {
  first_name: string
  middle_name?: string
  last_name: string
}

export type AddressInput = {
  address1: string
  address2?: string
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
