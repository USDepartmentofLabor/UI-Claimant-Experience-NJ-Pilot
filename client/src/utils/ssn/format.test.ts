import { getFormattedSsn } from './format'

describe('getFormattedSsn', () => {
  it('transforms an unformatted ssn properly', () => {
    const inputSsn = '111223333'
    const expectedSsn = '111-22-3333'
    const actualValue = getFormattedSsn(inputSsn)
    expect(actualValue).toEqual(expectedSsn)
  })
  it('returns the inputValue if it is not a valid ssn format', () => {
    const inputSsn = '11-222-3333'
    const actualValue = getFormattedSsn(inputSsn)
    expect(actualValue).toEqual(inputSsn)
  })
})
