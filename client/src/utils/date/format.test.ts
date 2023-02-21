import {
  formatUserInputDate,
  formatStoredDateToDisplayDate,
  formatLast18monthsEmployersDate,
  formatUserPoolDate,
  buildPersonalAddress,
  buildEmployerInputAddress,
  buildImportedEmployerAddress,
  buildAlternateEmployerAddress,
} from './format'

describe('formatUserInputDate', () => {
  it('returns the expected date', () => {
    const inputDateString1 = '10/18/2020'
    const inputDateString2 = 'January 11, 2014'
    const result1 = formatUserInputDate(inputDateString1)
    expect(result1).toEqual('2020-10-18')
    const result2 = formatUserInputDate(inputDateString2)
    expect(result2).toEqual('2014-01-11')
  })
  it('returns the input string if it is an invalid date', () => {
    const invalidDateString = '21-21-19'
    const result = formatUserInputDate(invalidDateString)
    expect(result).toEqual(invalidDateString)
  })
  it('returns undefined if there is no initial value', () => {
    const result = formatUserInputDate()
    expect(result).toEqual(undefined)
  })
})

describe('formatStoredDateToDisplayDate', () => {
  it('returns the expected date format', () => {
    const storedDate = '2009-08-20'
    const result = formatStoredDateToDisplayDate(storedDate)
    expect(result).toEqual('August 20, 2009')
  })

  it('returns undefined of storedDate is undefined', () => {
    const storedDate = undefined
    const result = formatStoredDateToDisplayDate(storedDate)
    expect(result).toEqual(undefined)
  })
  it('returns the input value if it is an invalid dayjs value', () => {
    const storedDate = 'some invalid string'
    const result = formatStoredDateToDisplayDate(storedDate)
    expect(result).toEqual(storedDate)
  })
})

describe('formatLast18monthsEmployersDate', () => {
  it('returns the first day of the first month in the quarter that is five quarters prior to the quarter passed in', () => {
    const initialDate = '2015-06-15'
    const result = formatLast18monthsEmployersDate(initialDate)
    expect(result).toEqual('January 1, 2014')
  })

  it('returns undefined if initialValue is undefined', () => {
    expect(formatLast18monthsEmployersDate(undefined)).toBeUndefined()
  })

  it('returns the initial value if the date format string is invalid', () => {
    const initialValue = '22-22-22'
    expect(formatLast18monthsEmployersDate(initialValue)).toEqual(initialValue)
  })

  it('returns a formatted user pool date', () => {
    const inputDateString1 = '10/18/2020'
    const inputDateString2 = 'January 11, 2014'
    const result1 = formatUserPoolDate(inputDateString1)
    expect(result1).toEqual('2020-10-18')
    const result2 = formatUserPoolDate(inputDateString2)
    expect(result2).toEqual('2014-01-11')
  })
})

describe('buildPersonalAddress', () => {
  it('returns the expected date with filled fields', () => {
    const personalAddress = buildPersonalAddress({
      address: 'some street',
      city: 'some city',
      state: 'CA',
      zipcode: '12345',
    })
    console.log(personalAddress)
    expect(personalAddress).toEqual('some street, some city, CA 12345')
  })
  it('returns the expected date when missing fields', () => {
    const personalAddress = buildPersonalAddress({
      address: '',
      city: 'some city',
      state: '',
      zipcode: '12345',
    })
    console.log(personalAddress)
    expect(personalAddress).toEqual('some city, 12345')
  })
})
describe('buildAlternateEmployerAddress', () => {
  it('returns the expected date with filled fields', () => {
    const alternateAddress = buildAlternateEmployerAddress({
      city: 'some city',
      state: 'CA',
      zipcode: '12345',
    })
    console.log(alternateAddress)
    expect(alternateAddress).toEqual('some city, CA 12345')
  })
  it('returns the expected date when missing fields', () => {
    const alternateAddress = buildAlternateEmployerAddress({
      city: '',
      state: '',
      zipcode: '12345',
    })
    console.log(alternateAddress)
    expect(alternateAddress).toEqual('12345')
  })
})
describe('buildImportedEmployerAddress', () => {
  it('returns the expected date with filled fields', () => {
    const importedAddress = buildImportedEmployerAddress({
      employerAddressLine1: 'suit#1',
      employerAddressLine2: 'Red building',
      employerAddressLine3: '1234 main street',
      employerAddressLine4: 'small town',
      employerAddressLine5: 'Nebraska',
      employerAddressZip: '12345',
    })
    console.log(importedAddress)
    expect(importedAddress).toEqual(
      'suit#1\nRed building\n1234 main street\nsmall town\nNebraska\n12345'
    )
  })
  it('returns the expected date when missing fields', () => {
    const importedAddress = buildImportedEmployerAddress({
      employerAddressLine1: 'suit#1',
      employerAddressLine2: '1234 main street',
      employerAddressLine3: '',
      employerAddressLine4: null,
      employerAddressLine5: 'Nebraska',
      employerAddressZip: '12345',
    }) //as ImportedEmployerAddress
    console.log(importedAddress)
    expect(importedAddress).toEqual('suit#1\n1234 main street\nNebraska\n12345')
  })
})

describe('buildEmployerInputAddress', () => {
  it('returns the expected date with filled fields', () => {
    const employerInput = buildEmployerInputAddress({
      address: 'some street',
      address2: 'some street2',
      address3: 'some street3',
      city: 'some city',
      state: 'CA',
      zipcode: '12345',
    })
    console.log(employerInput)
    expect(employerInput).toEqual(
      'some street, some street2, some street3, some city, CA 12345'
    )
  })
  it('returns the expected date when missing fields', () => {
    const employerInput = buildEmployerInputAddress({
      address: 'some street',
      address2: 'some street2',
      address3: '',
      city: '',
      state: 'CA',
      zipcode: '12345',
    })
    console.log(employerInput)
    expect(employerInput).toEqual('some street, some street2, CA 12345')
  })
})

describe('buildEmployerInputAddress', () => {
  it('returns the expected date with filled fields', () => {
    const employerInput = buildEmployerInputAddress({
      address: 'some street',
      address2: 'some street2',
      address3: 'some street3',
      city: 'some city',
      state: 'CA',
      zipcode: '12345',
    })
    console.log(employerInput)
    expect(employerInput).toEqual(
      'some street, some street2, some street3, some city, CA 12345'
    )
  })
  it('returns the expected date when missing fields', () => {
    const employerInput = buildEmployerInputAddress({
      address: 'some street',
      address2: 'some street2',
      address3: '',
      city: '',
      state: 'CA',
      zipcode: '12345',
    })
    console.log(employerInput)
    expect(employerInput).toEqual('some street, some street2, CA 12345')
  })
})
