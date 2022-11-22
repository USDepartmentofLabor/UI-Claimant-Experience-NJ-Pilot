import {
  PhoneInput,
  AddressInput,
  AddressWithoutStreetInput,
  PersonNameInput,
} from 'types/claimantInput'

export const PHONE_SKELETON: PhoneInput = {
  number: '',
  sms: undefined,
}

export const ADDRESS_SKELETON: AddressInput = {
  address: '',
  city: '',
  state: '',
  zipcode: '',
}

export const ADDRESS_WITHOUT_STREET_SKELETON: AddressWithoutStreetInput = {
  city: '',
  state: '',
  zipcode: '',
}

// skeleton shapes with which to initialize form fields
export const PERSON_NAME_SKELETON: PersonNameInput = {
  first_name: '',
  middle_initial: undefined,
  last_name: '',
  suffix: undefined,
}
