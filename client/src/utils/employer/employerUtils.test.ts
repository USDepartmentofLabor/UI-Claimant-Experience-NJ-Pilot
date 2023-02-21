import { Employer, YesNoInput } from 'types/claimantInput'
import {
  findEmployerByFein,
  findFirstImportedEmployerIndex,
  formatFein,
  mergeEmployers,
  parseCityAndStateFromImportedAddress,
  transformWgpmEmployer,
} from 'utils/employer/employerUtils'
import { EMPLOYER_SKELETON } from 'components/form/EditEmployer/EditEmployer'

const buildImportedEmployer = (
  name: string,
  workedForEmployer: YesNoInput = null,
  fein = ''
): Employer => {
  const baseFields = buildBaseEmployerFields(name, fein)

  return {
    ...baseFields,
    is_imported: true,
    worked_for_imported_employer_in_last_18mo: workedForEmployer,
    imported_address: {
      employerAddressLine1: 'line 1',
      employerAddressLine2: 'line 2',
      employerAddressLine3: 'line 3',
      employerAddressLine4: 'line 4',
      employerAddressLine5: 'line 5',
      employerAddressZip: '123435',
    },
    employer_phone: { number: '1234567890', sms: null },
  }
}

const buildManuallyAddedEmployer = (name: string, fein = ''): Employer => {
  const baseFields = buildBaseEmployerFields(name, fein)

  return {
    ...baseFields,
  }
}

const buildBaseEmployerFields = (name: string, fein: string) => ({
  ...EMPLOYER_SKELETON,
  employer_name: name,
  fein: fein,
  LOCAL_pay_types: [],
  payments_received: [],
})

describe('employerUtils', () => {
  describe('findFirstImportedEmployerIndex', () => {
    it('returns -1 when no imported employer', () => {
      const employer1 = buildManuallyAddedEmployer('employer1')
      const employer2 = buildManuallyAddedEmployer('employer2')
      const employer3 = buildManuallyAddedEmployer('employer3')
      const employers = [employer1, employer2, employer3]

      const index = findFirstImportedEmployerIndex(employers)

      expect(index).toEqual(-1)
    })

    it('returns -1 when no imported employers selected', () => {
      const employer1 = buildManuallyAddedEmployer('employer1')
      const employer2 = buildImportedEmployer('employer2', false)
      const employer3 = buildManuallyAddedEmployer('employer3')
      const employers = [employer1, employer2, employer3]

      const index = findFirstImportedEmployerIndex(employers)

      expect(index).toEqual(-1)
    })

    it('returns the index of the edited employer when one is present', () => {
      const employer1 = buildManuallyAddedEmployer('employer1')
      const employer2 = buildManuallyAddedEmployer('employer2')
      const employer3 = buildManuallyAddedEmployer('employer3')
      const employer4 = buildImportedEmployer('employer4', true)
      const employer5 = buildManuallyAddedEmployer('employer5')
      const employers = [employer1, employer2, employer3, employer4, employer5]

      const index = findFirstImportedEmployerIndex(employers)

      expect(index).toEqual(3)
    })

    it('returns the index of the first imported employer when multiple are present', () => {
      const employer1 = buildManuallyAddedEmployer('employer1')
      const employer2 = buildManuallyAddedEmployer('employer2')
      const employer3 = buildImportedEmployer('employer3', true)
      const employer4 = buildImportedEmployer('employer4', true)
      const employer5 = buildManuallyAddedEmployer('employer5')
      const employers = [employer1, employer2, employer3, employer4, employer5]

      const index = findFirstImportedEmployerIndex(employers)

      expect(index).toEqual(2)
    })
  })

  describe('formatFein', () => {
    it('0-pads the fein to the configured length', () => {
      const unformattedFein = '123'

      const formattedFein = formatFein(unformattedFein)

      expect(formattedFein).toEqual('123000000000000')
    })

    it('If the fein already ends in a 0, nothing special happens to resolve this bug', () => {
      const unformattedFein1 = '12300'
      const unformattedFein2 = '123'

      const formattedFein1 = formatFein(unformattedFein1)
      const formattedFein2 = formatFein(unformattedFein2)

      expect(formattedFein1).toEqual(formattedFein2)
    })
  })

  describe('transformWgpmEmployer', () => {
    it('transforms the fields from the wgpm employer to the expected format', () => {
      const wgpmEmployer = {
        employerAddressLine1: 'The Hall of Justice',
        employerAddressLine2: '2212 superhero street',
        employerAddressLine3: 'SUITE #2',
        employerAddressLine4: 'WASHINGTON DC',
        employerAddressLine5: null,
        employerAddressZip: '91121',
        employerFein: '031143718000011',
        employerName: 'Hall of Justice',
        employerSequenceNumber: '001',
        employerStatePayrollNumber: null,
        employerTelephoneNumber: '5554151012',
      }
      const expectedResult = {
        ...EMPLOYER_SKELETON,
        is_imported: true,
        employer_name: 'Hall of Justice',
        fein: '031143718000011',
        imported_address: {
          employerAddressLine1: 'The Hall of Justice',
          employerAddressLine2: '2212 superhero street',
          employerAddressLine3: 'SUITE #2',
          employerAddressLine4: 'WASHINGTON DC',
          employerAddressLine5: null,
          employerAddressZip: '91121',
        },
        employer_phone: {
          number: '5554151012',
          sms: null,
        },
      }

      const result = transformWgpmEmployer(wgpmEmployer)
      expect(result).toEqual(expectedResult)
    })

    it('sets missing name, fein, and phone number to the correct initial values', () => {
      const wgpmEmployer = {
        employerAddressLine1: 'The Hall of Justice',
        employerAddressLine2: '2212 superhero street',
        employerAddressLine3: 'SUITE #2',
        employerAddressLine4: 'WASHINGTON DC',
        employerAddressLine5: null,
        employerAddressZip: '91121',
        employerFein: null,
        employerName: null,
        employerSequenceNumber: '001',
        employerStatePayrollNumber: null,
        employerTelephoneNumber: null,
      }
      const expectedResult = {
        ...EMPLOYER_SKELETON,
        is_imported: true,
        employer_name: EMPLOYER_SKELETON.employer_name,
        fein: EMPLOYER_SKELETON.fein,
        imported_address: {
          employerAddressLine1: 'The Hall of Justice',
          employerAddressLine2: '2212 superhero street',
          employerAddressLine3: 'SUITE #2',
          employerAddressLine4: 'WASHINGTON DC',
          employerAddressLine5: null,
          employerAddressZip: '91121',
        },
        employer_phone: {
          number: EMPLOYER_SKELETON.employer_phone.number,
          sms: null,
        },
      }

      const result = transformWgpmEmployer(wgpmEmployer)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('parseCityAndStateFromImportedAddress', () => {
    it.each([
      {
        employerAddressLine1: 'line1',
        employerAddressLine2: 'line2',
        employerAddressLine3: 'line3',
        employerAddressLine4: 'line4',
        employerAddressLine5: 'CITY ST',
        employerAddressZip: '12345',
      },
      {
        employerAddressLine1: 'line1',
        employerAddressLine2: 'line2',
        employerAddressLine3: 'line3',
        employerAddressLine5: 'CITY ST',
        employerAddressLine4: null,
        employerAddressZip: '12345',
      },
      {
        employerAddressLine1: 'line1',
        employerAddressLine2: 'line2',
        employerAddressLine3: 'CITY ST',
        employerAddressLine5: null,
        employerAddressLine4: null,
        employerAddressZip: '12345',
      },
      {
        employerAddressLine1: 'line1',
        employerAddressLine2: 'CITY ST',
        employerAddressLine3: null,
        employerAddressLine5: null,
        employerAddressLine4: null,
        employerAddressZip: '12345',
      },
      {
        employerAddressLine1: 'CITY ST',
        employerAddressLine2: null,
        employerAddressLine3: null,
        employerAddressLine5: null,
        employerAddressLine4: null,
        employerAddressZip: '12345',
      },
    ])(
      'parses the city and state from the last filled line',
      (importedAddress) => {
        const { city, state } =
          parseCityAndStateFromImportedAddress(importedAddress)

        expect(city).toEqual('CITY')
        expect(state).toEqual('ST')
      }
    )

    it('parses the city and state with a comma', () => {
      const { city, state } = parseCityAndStateFromImportedAddress({
        employerAddressLine1: 'line1',
        employerAddressLine2: 'CITY, ST',
        employerAddressLine3: null,
        employerAddressLine5: null,
        employerAddressLine4: null,
        employerAddressZip: '12345',
      })

      expect(city).toEqual('CITY')
      expect(state).toEqual('ST')
    })

    it.each([
      {
        employerAddressLine1: 'line1',
        employerAddressLine2: 'line2',
        employerAddressLine3: null,
        employerAddressLine5: null,
        employerAddressLine4: null,
        employerAddressZip: '12345',
      },
      {
        employerAddressLine1: 'line1',
        employerAddressLine2: 'CityST',
        employerAddressLine3: null,
        employerAddressLine5: null,
        employerAddressLine4: null,
        employerAddressZip: '12345',
      },
      {
        employerAddressLine1: null,
        employerAddressLine2: null,
        employerAddressLine3: null,
        employerAddressLine5: null,
        employerAddressLine4: null,
        employerAddressZip: '12345',
      },
    ])(
      'returns undefined values when city and state are not defined in the imported address and/or cannot be parsed',
      (importedAddress) => {
        const { city, state } =
          parseCityAndStateFromImportedAddress(importedAddress)

        expect(city).toBeUndefined()
        expect(state).toBeUndefined()
      }
    )
  })

  describe('findEmployerByFein', () => {
    it('gets the employer by fein', () => {
      const employer1 = buildManuallyAddedEmployer(
        'employer1',
        '100000000000000'
      )
      const employer2 = buildManuallyAddedEmployer(
        'employer2',
        '200000000000000'
      )
      const employer3 = buildManuallyAddedEmployer(
        'employer3',
        '300000000000000'
      )
      const employer4 = buildManuallyAddedEmployer(
        'employer4',
        '400000000000000'
      )
      const employer5 = buildManuallyAddedEmployer(
        'employer5',
        '500000000000000'
      )
      const employers = [employer1, employer2, employer3, employer4, employer5]

      const employerByFein = findEmployerByFein(employers, '300000000000000')

      expect(employerByFein).toEqual(employer3)
    })
    it('gets the employer by matching formatted fein', () => {
      const employer1 = buildManuallyAddedEmployer(
        'employer1',
        '100000000000000'
      )
      const employer2 = buildManuallyAddedEmployer(
        'employer2',
        '200000000000000'
      )
      const employer3 = buildManuallyAddedEmployer(
        'employer3',
        '300000000000000'
      )
      const employer4 = buildManuallyAddedEmployer(
        'employer4',
        '400000000000000'
      )
      const employer5 = buildManuallyAddedEmployer(
        'employer5',
        '500000000000000'
      )
      const employers = [employer1, employer2, employer3, employer4, employer5]

      const employerByFein = findEmployerByFein(employers, '3')

      expect(employerByFein).toEqual(employer3)
    })
    it('gets the employer by matching formatted fein to formatted fein', () => {
      const employer1 = buildManuallyAddedEmployer('employer1', '100')
      const employer2 = buildManuallyAddedEmployer('employer2', '200')
      const employer3 = buildManuallyAddedEmployer('employer3', '300')
      const employer4 = buildManuallyAddedEmployer('employer4', '400')
      const employer5 = buildManuallyAddedEmployer('employer5', '500')
      const employers = [employer1, employer2, employer3, employer4, employer5]

      const employerByFein = findEmployerByFein(employers, '3')

      expect(employerByFein).toEqual(employer3)
    })
    it('returns undefined when there is no match', () => {
      const employer1 = buildManuallyAddedEmployer('employer1', '1')
      const employer2 = buildManuallyAddedEmployer('employer2', '2')
      const employer3 = buildManuallyAddedEmployer('employer3', '3')
      const employer4 = buildManuallyAddedEmployer('employer4', '4')
      const employer5 = buildManuallyAddedEmployer('employer5', '5')
      const employers = [employer1, employer2, employer3, employer4, employer5]

      const employerByFein = findEmployerByFein(employers, '6')

      expect(employerByFein).toEqual(undefined)
    })
  })

  describe('mergeEmployers', () => {
    it('consolidates imported and manually added employers', () => {
      const manuallyAddedEmployer1 = buildManuallyAddedEmployer(
        'manual employer1',
        '1'
      )
      const manuallyAddedEmployer2 = buildManuallyAddedEmployer(
        'manual employer2',
        '2'
      )
      const manuallyAddedEmployers = [
        manuallyAddedEmployer1,
        manuallyAddedEmployer2,
      ]

      const importedEmployer1 = buildImportedEmployer(
        'imported employer1',
        true,
        '3'
      )
      const importedEmployer2 = buildImportedEmployer(
        'imported employer2',
        true,
        '4'
      )
      const importedEmployers = [importedEmployer1, importedEmployer2]

      const mergedEmployers = mergeEmployers(
        importedEmployers,
        manuallyAddedEmployers
      )

      expect(mergedEmployers).toHaveLength(4)

      const mergedEmployer1 = findEmployerByFein(mergedEmployers, '1')
      const mergedEmployer2 = findEmployerByFein(mergedEmployers, '2')
      const mergedEmployer3 = findEmployerByFein(mergedEmployers, '3')
      const mergedEmployer4 = findEmployerByFein(mergedEmployers, '4')

      expect(mergedEmployer1).not.toBeUndefined()
      expect(mergedEmployer1?.is_imported).toBeFalsy()
      expect(mergedEmployer1?.employer_name).toEqual('manual employer1')

      expect(mergedEmployer2).not.toBeUndefined()
      expect(mergedEmployer2?.is_imported).toBeFalsy()
      expect(mergedEmployer2?.employer_name).toEqual('manual employer2')

      // check that the imported employers retain their imported fields
      expect(mergedEmployer3).not.toBeUndefined()
      expect(mergedEmployer3?.is_imported).toBeTruthy()
      expect(mergedEmployer3?.employer_name).toEqual('imported employer1')
      expect(
        mergedEmployer3?.imported_address?.employerAddressLine1
      ).not.toBeUndefined()
      expect(
        mergedEmployer3?.imported_address?.employerAddressLine2
      ).not.toBeUndefined()
      expect(
        mergedEmployer3?.imported_address?.employerAddressLine3
      ).not.toBeUndefined()
      expect(
        mergedEmployer3?.imported_address?.employerAddressLine4
      ).not.toBeUndefined()
      expect(
        mergedEmployer3?.imported_address?.employerAddressLine5
      ).not.toBeUndefined()
      expect(
        mergedEmployer3?.imported_address?.employerAddressZip
      ).not.toBeUndefined()

      expect(mergedEmployer4).not.toBeUndefined()
      expect(mergedEmployer4?.is_imported).toBeTruthy()
      expect(mergedEmployer4?.employer_name).toEqual('imported employer2')
      expect(
        mergedEmployer4?.imported_address?.employerAddressLine1
      ).not.toBeUndefined()
      expect(
        mergedEmployer4?.imported_address?.employerAddressLine2
      ).not.toBeUndefined()
      expect(
        mergedEmployer4?.imported_address?.employerAddressLine3
      ).not.toBeUndefined()
      expect(
        mergedEmployer4?.imported_address?.employerAddressLine4
      ).not.toBeUndefined()
      expect(
        mergedEmployer4?.imported_address?.employerAddressLine5
      ).not.toBeUndefined()
      expect(
        mergedEmployer4?.imported_address?.employerAddressZip
      ).not.toBeUndefined()
    })

    it('reconciles previously imported employers with newly imported employers, preferring newly imported values', () => {
      const previouslySavedImportedEmployer = buildImportedEmployer(
        'old name',
        true,
        '1'
      )
      const previouslySavedEmployers = [previouslySavedImportedEmployer]

      const newlyImportedEmployer = buildImportedEmployer(
        'new name',
        undefined,
        '1'
      )
      newlyImportedEmployer.imported_address = {
        employerAddressLine1: 'new line 1',
        employerAddressLine2: 'new line 2',
        employerAddressLine3: 'new line 3',
        employerAddressLine4: 'new line 4',
        employerAddressLine5: 'new line 5',
        employerAddressZip: '23456',
      }
      newlyImportedEmployer.employer_phone = {
        number: '1238675309',
        sms: null,
      }
      const newlyImportedEmployers = [newlyImportedEmployer]

      const mergedEmployers = mergeEmployers(
        newlyImportedEmployers,
        previouslySavedEmployers
      )

      expect(mergedEmployers).toHaveLength(1)

      const reconciledEmployer = mergedEmployers.at(0) as Employer

      expect(reconciledEmployer.employer_name).toEqual('new name')
      expect(reconciledEmployer.imported_address?.employerAddressLine1).toEqual(
        'new line 1'
      )
      expect(reconciledEmployer.imported_address?.employerAddressLine2).toEqual(
        'new line 2'
      )
      expect(reconciledEmployer.imported_address?.employerAddressLine3).toEqual(
        'new line 3'
      )
      expect(reconciledEmployer.imported_address?.employerAddressLine4).toEqual(
        'new line 4'
      )
      expect(reconciledEmployer.imported_address?.employerAddressLine5).toEqual(
        'new line 5'
      )
      expect(reconciledEmployer.imported_address?.employerAddressZip).toEqual(
        '23456'
      )
      expect(reconciledEmployer.employer_phone?.number).toEqual('1238675309')
    })

    it('reconciles previously imported employers retaining additional manual entry', () => {
      const previouslySavedImportedEmployer = buildImportedEmployer(
        'old name',
        true,
        '1'
      )
      previouslySavedImportedEmployer.is_full_time = true
      previouslySavedImportedEmployer.alternate_physical_work_address = {
        city: 'Trenton',
        state: 'NJ',
        zipcode: '11111',
      }
      previouslySavedImportedEmployer.work_location_phone = {
        number: '1112223333',
        sms: null,
      }
      const previouslySavedEmployers = [previouslySavedImportedEmployer]

      const newlyImportedEmployer = buildImportedEmployer(
        'new name',
        undefined,
        '1'
      )
      newlyImportedEmployer.imported_address = {
        employerAddressLine1: 'new line 1',
        employerAddressLine2: 'new line 2',
        employerAddressLine3: 'new line 3',
        employerAddressLine4: 'new line 4',
        employerAddressLine5: 'new line 5',
        employerAddressZip: '23456',
      }
      newlyImportedEmployer.employer_phone = {
        number: '1238675309',
        sms: null,
      }
      const newlyImportedEmployers = [newlyImportedEmployer]

      const mergedEmployers = mergeEmployers(
        newlyImportedEmployers,
        previouslySavedEmployers
      )

      expect(mergedEmployers).toHaveLength(1)

      const reconciledEmployer = mergedEmployers.at(0) as Employer

      expect(reconciledEmployer.employer_name).toEqual('new name')
      expect(reconciledEmployer.imported_address).toEqual({
        employerAddressLine1: 'new line 1',
        employerAddressLine2: 'new line 2',
        employerAddressLine3: 'new line 3',
        employerAddressLine4: 'new line 4',
        employerAddressLine5: 'new line 5',
        employerAddressZip: '23456',
      })
      expect(reconciledEmployer.employer_phone?.number).toEqual('1238675309')
      expect(reconciledEmployer.is_full_time).toEqual(true)
      expect(reconciledEmployer.alternate_physical_work_address).toEqual({
        city: 'Trenton',
        state: 'NJ',
        zipcode: '11111',
      })
      expect(reconciledEmployer.work_location_phone).toEqual({
        number: '1112223333',
        sms: null,
      })
    })

    it('removes previously imported employers that are no longer present in the newly imported values', () => {
      const previouslySavedImportedEmployer = buildImportedEmployer(
        'previously imported',
        true,
        '1'
      )
      const previouslySavedEmployers = [previouslySavedImportedEmployer]

      const newlyImportedEmployer = buildImportedEmployer(
        'newly imported',
        undefined,
        '2'
      )
      const newlyImportedEmployers = [newlyImportedEmployer]

      const mergedEmployers = mergeEmployers(
        newlyImportedEmployers,
        previouslySavedEmployers
      )

      expect(mergedEmployers).toHaveLength(1)

      const mergedEmployer = mergedEmployers.at(0) as Employer

      expect(mergedEmployer).toEqual(newlyImportedEmployer)
    })

    it("appends imported employers even if they're missing fein", () => {
      const previouslySavedImportedEmployer = buildImportedEmployer(
        'previously saved',
        true,
        '1'
      )
      const previouslySavedEmployers = [previouslySavedImportedEmployer]

      const newlyImportedEmployer = buildImportedEmployer(
        'newly imported',
        undefined,
        undefined
      )
      const newlyImportedEmployers = [
        newlyImportedEmployer,
        previouslySavedImportedEmployer,
      ]

      const mergedEmployers = mergeEmployers(
        newlyImportedEmployers,
        previouslySavedEmployers
      )

      expect(mergedEmployers).toHaveLength(2)

      const mergedImportedEmployer = mergedEmployers
        .filter(
          (employer) =>
            employer.is_imported && employer.employer_name === 'newly imported'
        )
        .at(0) as Employer

      expect(mergedImportedEmployer).toEqual(newlyImportedEmployer)
      expect(mergedImportedEmployer.fein).toEqual('')
    })
  })
})
