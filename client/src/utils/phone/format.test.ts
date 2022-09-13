import { formatStoredToDisplayPhone } from './format'

describe('formatStoredToDisplayPhone', () => {
  it('returns the expected format', () => {
    const formattedPhone = formatStoredToDisplayPhone('1234567891')
    expect(formattedPhone).toEqual('123-456-7891')
  })
  it('returns undefined if argument is undefined', () => {
    const formattedPhone = formatStoredToDisplayPhone(undefined)
    expect(formattedPhone).toEqual(undefined)
  })
})
