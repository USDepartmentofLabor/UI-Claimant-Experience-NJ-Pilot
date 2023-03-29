import {
  yupAddress,
  yupAddressWithoutPOBox,
  yupAddressWithoutStreet,
  yupCurrency,
  yupDate,
  yupName,
  yupPhone,
  yupPhoneOptional,
  yupPhoneWithSMS,
} from 'validations/yup/custom'

describe('custom yup validations', () => {
  describe('yupCurrency', () => {
    it('accepts valid values', async () => {
      const result = await yupCurrency().isValid('100')
      expect(result).toBeTruthy()
    })
    it('rejects invalid values', async () => {
      const result = await yupCurrency().isValid('100.13')
      expect(result).toBeFalsy()
    })
  })

  describe('yupDate', () => {
    it('accepts valid values', async () => {
      const result = await yupDate('myField').isValid('2001-08-16')
      expect(result).toBeTruthy()
    })
    it('rejects invalid values', async () => {
      const result = await yupDate('myField').isValid('08-16-2001')
      expect(result).toBeFalsy()
    })
  })

  describe('yupAddress', () => {
    it('accepts valid values', async () => {
      const result = await yupAddress().isValid({
        address: '123 main st',
        city: 'Everytown',
        state: 'MD',
        zipcode: '12345',
      })
      expect(result).toBeTruthy()
    })
    it('accepts valid values with address2', async () => {
      const result = await yupAddressWithoutPOBox().isValid({
        address: '123 main st',
        address2: 'Unit 2B',
        city: 'Everytown',
        state: 'MD',
        zipcode: '12345',
      })
      expect(result).toBeTruthy()
    })
    it('rejects invalid values missing zipcode', async () => {
      const result = await yupAddress().isValid({
        address: '123 main st',
        city: 'Everytown',
        state: 'MD',
      })
      expect(result).toBeFalsy()
    })
    it('rejects invalid values missing city', async () => {
      const result = await yupAddress().isValid({
        address: '123 main st',
        state: 'MD',
        zipcode: '12345',
      })
      expect(result).toBeFalsy()
    })
  })

  describe('yupAddressWithoutPOBox', () => {
    it('accepts valid values', async () => {
      const result = await yupAddressWithoutPOBox().isValid({
        address: '123 main st',
        city: 'Everytown',
        state: 'MD',
        zipcode: '12345',
      })
      expect(result).toBeTruthy()
    })
    it('accepts valid values with address2', async () => {
      const result = await yupAddressWithoutPOBox().isValid({
        address: '123 main st',
        address2: 'Unit 2B',
        city: 'Everytown',
        state: 'MD',
        zipcode: '12345',
      })
      expect(result).toBeTruthy()
    })
    it('rejects invalid values', async () => {
      const result = await yupAddressWithoutPOBox().isValid({
        address: '123 main st PO Box 4',
        city: 'Everytown',
        state: 'MD',
        zipcode: '12345',
      })
      expect(result).toBeFalsy()
    })
  })

  describe('yupAddressWithoutStreet', () => {
    it('accepts valid values', async () => {
      const result = await yupAddressWithoutStreet().isValid({
        city: 'Everytown',
        state: 'MD',
        zipcode: '12345',
      })
      expect(result).toBeTruthy()
    })
    it('rejects invalid values', async () => {
      const result = await yupAddressWithoutStreet().isValid({
        city: 'Everytown',
        zipcode: '12345',
      })
      expect(result).toBeFalsy()
    })
  })

  describe('yupName', () => {
    it('accepts valid values', async () => {
      const result = await yupName.isValid({
        first_name: 'Hermione',
        last_name: 'Grainger',
        middle_initial: 'T',
        suffix: 'I',
      })
      expect(result).toBeTruthy()
    })
    it('rejects invalid values', async () => {
      const result = await yupName.isValid({ last_name: 'Grainger' })
      expect(result).toBeFalsy()
    })
  })

  describe('yupPhone', () => {
    it('accepts valid values', async () => {
      const result = await yupPhone.isValid({ number: '555-123-3232' })
      expect(result).toBeTruthy()
    })
    it('rejects invalid values', async () => {
      const result = await yupPhone.isValid({
        number: '555-READ-ME',
        sms: true,
      })
      expect(result).toBeFalsy()
    })
  })

  describe('yupPhoneWithSMS', () => {
    it('accepts valid values', async () => {
      const result = await yupPhoneWithSMS.isValid({
        number: '555-123-3232',
        sms: true,
      })
      expect(result).toBeTruthy()
    })
    it('rejects invalid values', async () => {
      const result = await yupPhoneWithSMS.isValid({ number: '555-123-3232' })
      expect(result).toBeFalsy()
    })
  })

  describe('yupPhoneOptional', () => {
    it('accepts valid values', async () => {
      const result = yupPhoneOptional.isValid({ number: '' })
      expect(result).toBeTruthy()
      const result2 = yupPhoneOptional.isValid({
        number: '555-123-3232',
        sms: true,
      })
      expect(result2).toBeTruthy()
    })
  })
})
