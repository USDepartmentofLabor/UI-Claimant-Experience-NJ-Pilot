import { yupCurrency } from 'validations/yup/custom'

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
})
