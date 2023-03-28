import { Employer } from 'types/claimantInput'
import { EMPLOYER_SKELETON } from 'components/form/EditEmployer/EditEmployer'

// Loops WGPM returns FEINs with 15 characters, left aligned and right-padded to 15 characters
const FORMATTED_FEIN_LENGTH = 15

export const findFirstImportedEmployerIndex = (employers: Employer[]) =>
  employers.findIndex(
    (employer) =>
      employer.is_imported && employer.worked_for_imported_employer_in_last_18mo
  )

/**
 * Formats the fein so that it matches the loops format
 * Note that an fein ending with a 0 before it is padded would be considered
 * equal to an fein that does not end in 0 but is otherwise the same e.g.
 * 12345 vs 123450. Both would be returned from loops with the same value, so we
 * don't take care to deal with the conflict in this application
 * @param fein the unformatted fein
 */
export const formatFein = (fein: string) =>
  fein.padEnd(FORMATTED_FEIN_LENGTH, '0')

export type WgpmEmployer = {
  employerAddressLine1: string | null
  employerAddressLine5: string | null
  employerAddressLine4: string | null
  employerAddressLine3: string | null
  employerAddressLine2: string | null
  employerFein: string | null
  employerAddressZip: string | null
  employerName: string | null
  employerStatePayrollNumber: string | null
  employerTelephoneNumber: string | null
  employerSequenceNumber: string | null
}

/**
 * Transforms the raw WGPM employer format to the intake app Employer format
 * @param wgpmEmployer an employer returned from the WGPM response
 */
export const transformWgpmEmployer = (
  wgpmEmployer: WgpmEmployer
): Employer => ({
  ...EMPLOYER_SKELETON, // Start with the skeleton and overwrite relevant values
  is_imported: true,
  employer_name: wgpmEmployer.employerName || '',
  fein: wgpmEmployer.employerFein || '',
  imported_address: {
    employerAddressLine1: wgpmEmployer.employerAddressLine1,
    employerAddressLine2: wgpmEmployer.employerAddressLine2,
    employerAddressLine3: wgpmEmployer.employerAddressLine3,
    employerAddressLine4: wgpmEmployer.employerAddressLine4,
    employerAddressLine5: wgpmEmployer.employerAddressLine5,
    employerAddressZip: wgpmEmployer.employerAddressZip,
  },
  employer_phone: {
    number: wgpmEmployer.employerTelephoneNumber || '',
    sms: null,
  },
  payments_received: [],
  LOCAL_pay_types: [],
})

export const findEmployerByFein = (employers: Employer[], fein: string) =>
  employers.find(
    (employer) =>
      employer.fein &&
      formatFein(employer.fein.toLowerCase()) === formatFein(fein.toLowerCase())
  )

/**
 * Makes an attempt to reconcile WGPM employers and the claimants previously entered/edited employers
 * @param importedEmployers the employers from the WGPM call. These are near-real time to day-old data, and cached as configured by the React Query
 * @param previouslySavedEmployers the employers in the claim form payload. These are either manually entered or previously imported
 */
export const mergeEmployers = (
  importedEmployers: Employer[],
  previouslySavedEmployers?: Employer[]
) => {
  const mergedEmployers: Employer[] = []

  if (previouslySavedEmployers) {
    // Reconcile existing employers with WGPM employers
    previouslySavedEmployers.forEach((previouslySavedEmployer) => {
      if (previouslySavedEmployer.is_imported) {
        if (previouslySavedEmployer.fein) {
          const matchingImportedEmployer = findEmployerByFein(
            importedEmployers,
            previouslySavedEmployer.fein
          )

          if (matchingImportedEmployer) {
            // V1:
            // EDITABLE values will take precedence because a claimant may have edited the WGPM employer.
            // IMPORTED values will take precedence as the only way for those values to be updated is via the WGPM
            // information changing.
            // Missing fields will be included from the WGPM employer.
            const mergedEmployer = {
              ...matchingImportedEmployer,
              ...previouslySavedEmployer,
              employer_name: matchingImportedEmployer.employer_name,
              imported_address: matchingImportedEmployer.imported_address,
              employer_phone: matchingImportedEmployer.employer_phone,
            }
            mergedEmployers.push(mergedEmployer)
          }
          // If there is no fein-matched imported employer, that may be because it is longer be part of the WGPM
          // response, OR the fein in the WGPM response has changed.

          // V1:
          // [DESTRUCTIVE OPERATION] When merging employers, do not add previously imported employers that WGPM no
          // longer returns records for.
          // The claimant would need to manually add it since it can no longer be imported
        }
      } else {
        // Preserve non-imported employers
        mergedEmployers.push(previouslySavedEmployer)
      }
    })
  }

  // Add the remaining WGPM employers that have not already been reconciled
  importedEmployers.forEach((importedEmployer) => {
    if (importedEmployer.fein) {
      const matchingEmployer = findEmployerByFein(
        mergedEmployers,
        importedEmployer.fein
      )
      if (!matchingEmployer) {
        mergedEmployers.push(importedEmployer)
      }
    } else {
      // V1:
      // Imported employer does not have an fein, add it anyway so that the user can choose if they worked there, or
      // if they'd rather manually enter the info for that employer
      mergedEmployers.push(importedEmployer)
    }
  })

  return mergedEmployers
}
