import { getStatesTerritoriesProvincesNameFromAbbrev } from './reviewUtils'

describe('getStatesTerritoriesProvincesNameFromAbbrev', () => {
  it('displays state/territory/province full name from abbrev properly', () => {
    const inputAbbrev = 'AL'
    const expectedAbbrev = 'Alabama'
    const actualValue = getStatesTerritoriesProvincesNameFromAbbrev(inputAbbrev)
    expect(actualValue).toEqual(expectedAbbrev)
  })
  it('returns the inputAbbrev if it is not a valid ssn format', () => {
    const inputAbbrev = 'AA'
    const actualValue = getStatesTerritoriesProvincesNameFromAbbrev(inputAbbrev)
    expect(actualValue).toEqual(inputAbbrev)
  })
})
