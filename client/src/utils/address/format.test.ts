import {
  buildPersonalAddress,
  buildEmployerInputAddress,
  buildImportedEmployerAddress,
  buildAlternateEmployerAddress,
} from './format'

describe('buildPersonalAddress', () => {
  it('returns the expected date with filled fields', () => {
    const personalAddress = buildPersonalAddress({
      address: 'some street',
      address2: '',
      city: 'some city',
      state: 'CA',
      zipcode: '12345',
    })

    expect(personalAddress).toEqual('some street, some city, CA 12345')
  })
  it('returns the expected date when missing fields', () => {
    const personalAddress = buildPersonalAddress({
      address: '',
      address2: '',
      city: 'some city',
      state: '',
      zipcode: '12345',
    })

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

    expect(alternateAddress).toEqual('some city, CA 12345')
  })
  it('returns the expected date when missing fields', () => {
    const alternateAddress = buildAlternateEmployerAddress({
      city: '',
      state: '',
      zipcode: '12345',
    })

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
    })

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

    expect(employerInput).toEqual('some street, some street2, CA 12345')
  })
})
