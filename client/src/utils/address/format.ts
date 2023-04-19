import dayjs from 'dayjs'
import quarterYear from 'dayjs/plugin/quarterOfYear'
dayjs.extend(quarterYear)

import {
  AddressInput,
  AddressWithoutStreetInput,
  EmployerAddressInput,
  ImportedEmployerAddress,
} from 'types/claimantInput'

export const buildAlternateEmployerAddress = (
  alternateEmployerAddress: AddressWithoutStreetInput | undefined
) => {
  const { city, state, zipcode } = alternateEmployerAddress || {}
  if (state === undefined && city === undefined && zipcode === undefined) {
    return undefined
  }

  return combineAddresses([city], state, zipcode, ', ')
}
const isEmptyAddressField = (address: string | undefined | null) => {
  return address && address !== ''
}
const isEmptyAddressList = (
  addresses: (string | undefined | null)[] | undefined
) => {
  if (!addresses) {
    return false
  }
  return addresses.forEach((element) => {
    return isEmptyAddressField(element)
  })
}
const addAddress = (
  currentAddr: string,
  newAddition: string | undefined | null,
  delimiter: string
) => {
  if (newAddition === undefined || newAddition === null || newAddition === '') {
    return currentAddr
  }

  if (currentAddr !== '') {
    currentAddr = currentAddr.concat(delimiter)
  }

  currentAddr = currentAddr.concat(newAddition)

  return currentAddr
}

const combineAddresses = (
  addresses: (string | undefined | null)[] | undefined,
  state: string | undefined | null,
  zipcode: string | undefined | null,
  delimiter: string
) => {
  let addr = ''

  if (
    !(
      isEmptyAddressField(state) &&
      isEmptyAddressField(zipcode) &&
      isEmptyAddressList(addresses)
    )
  ) {
    let zipcodeDelimiter = delimiter
    if (addresses) {
      for (const addressField of addresses) {
        addr = addAddress(addr, addressField, delimiter)
      }
      addr = addAddress(addr, state, delimiter)

      //if we have a state value only add a space between zip & state
      if (state && zipcode) {
        zipcodeDelimiter = ' '
      }

      addr = addAddress(addr, zipcode, zipcodeDelimiter)
    }
  }
  return addr
}

export const buildEmployerInputAddress = (
  addressInput: EmployerAddressInput | undefined
) => {
  const { address, address2, address3, city, state, zipcode } =
    addressInput || {}

  return combineAddresses(
    [address, address2, address3, city],
    state,
    zipcode,
    ', '
  )
}
export const buildImportedEmployerAddress = (
  importedAddress: ImportedEmployerAddress | null
) => {
  const {
    employerAddressLine1,
    employerAddressLine2,
    employerAddressLine3,
    employerAddressLine4,
    employerAddressLine5,
    employerAddressZip,
  } = importedAddress || {}

  return combineAddresses(
    [
      employerAddressLine1,
      employerAddressLine2,
      employerAddressLine3,
      employerAddressLine4,
      employerAddressLine5,
    ],
    undefined,
    employerAddressZip,
    '\n'
  )
}
export const buildPersonalAddress = (
  personalAddress: AddressInput | undefined
) => {
  const { address, address2, state, city, zipcode } = personalAddress || {}
  return combineAddresses([address, address2, city], state, zipcode, ', ')
}
