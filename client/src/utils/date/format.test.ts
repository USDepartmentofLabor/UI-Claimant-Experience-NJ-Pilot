import {
  formatUserInputDate,
  formatStoredDateToDisplayDate,
  formatLast18monthsEmployersDate,
  formatUserPoolDate,
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
})

describe('formatStoredDate', () => {
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
