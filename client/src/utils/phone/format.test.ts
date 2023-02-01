import { formatStoredToDisplayPhone } from './format'

describe('formatStoredToDisplayPhone', () => {
  it('returns the expected format when at length 10', () => {
    const formattedPhone = formatStoredToDisplayPhone('1234567891')
    expect(formattedPhone).toEqual('123-456-7891')
  })
  it('returns the unformated phone number when not at length 10', () => {
    const formattedPhone = formatStoredToDisplayPhone('12345678910')
    expect(formattedPhone).toEqual('12345678910')
  })
  it('returns undefined if argument is undefined', () => {
    const formattedPhone = formatStoredToDisplayPhone(undefined)
    expect(formattedPhone).toEqual(undefined)
  })
})
