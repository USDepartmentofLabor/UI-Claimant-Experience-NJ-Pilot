import { PhoneInput, AddressInput, PersonNameInput } from 'types/claimantInput'

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

// skeleton shapes with which to initialize form fields
export const PERSON_NAME_SKELETON: PersonNameInput = {
  first_name: '',
  middle_initial: undefined,
  last_name: '',
  suffix: undefined,
}
