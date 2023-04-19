import {
  PhoneInput,
  AddressInput,
  EmployerAddressInput,
  AddressWithoutStreetInput,
  PersonNameInput,
} from 'types/claimantInput'
import {
  EMPTY_DROPDOWN_OPTION,
  UNTOUCHED_RADIO_VALUE,
} from 'constants/formOptions'

export const PHONE_SKELETON: PhoneInput = {
  number: '',
  sms: UNTOUCHED_RADIO_VALUE,
}

export const ADDRESS_SKELETON: AddressInput = {
  address: '',
  address2: '',
  city: '',
  state: EMPTY_DROPDOWN_OPTION,
  zipcode: '',
}

export const EMPLOYER_ADDRESS_SKELETON: EmployerAddressInput = {
  address: '',
  address2: '',
  address3: '',
  city: '',
  state: EMPTY_DROPDOWN_OPTION,
  zipcode: '',
}

export const ADDRESS_WITHOUT_STREET_SKELETON: AddressWithoutStreetInput = {
  city: '',
  state: EMPTY_DROPDOWN_OPTION,
  zipcode: '',
}

// skeleton shapes with which to initialize form fields
export const PERSON_NAME_SKELETON: PersonNameInput = {
  first_name: '',
  middle_initial: '',
  last_name: '',
  suffix: EMPTY_DROPDOWN_OPTION,
}
