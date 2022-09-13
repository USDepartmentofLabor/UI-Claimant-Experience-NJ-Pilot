import { PhoneInput, AddressInput, PersonNameInput } from 'types/claimantInput'

export const PHONE_SKELETON: PhoneInput = {
  number: '',
  sms: undefined,
}

export const ADDRESS_SKELETON: AddressInput = {
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipcode: '',
}

// skeleton shapes with which to initialize form fields
export const PERSON_NAME_SKELETON: PersonNameInput = {
  first_name: '',
  middle_initial: '',
  last_name: '',
  suffix: undefined,
}
