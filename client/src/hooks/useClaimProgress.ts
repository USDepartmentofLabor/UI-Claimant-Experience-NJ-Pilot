import { useContext, useEffect, useState } from 'react'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
import { prepareDataForValidation } from 'formik'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { yupEditEmployer } from 'components/form/EditEmployer/EditEmployer'
import { ClaimantInput } from 'types/claimantInput'

// seperated the logic here for unit testing
export const areImportedEmployersValid = (values: ClaimantInput) => {
  // Employer array is valid
  return values.employers
    ? values.employers
        .filter((employer) => employer.is_imported)
        .every((importedEmployer) => {
          switch (importedEmployer.worked_for_imported_employer_in_last_18mo) {
            case true:
              // claimant worked for employer, should be validated
              return yupEditEmployer.isValidSync(
                prepareDataForValidation(importedEmployer)
              )
            case false:
              // claimant did not work for this employer, no need to validate
              return true
            case undefined:
              // claimant has not answered, recent-employers is not valid
              return false
          }
        })
    : true
}

export const useClaimProgress = () => {
  const { claimFormValues } = useContext(ClaimFormContext)

  const [continuePath, setContinuePath] = useState(Routes.HOME)

  useEffect(() => {
    if (claimFormValues) {
      let continuePage = ''
      pageDefinitions.every((page) => {
        continuePage = page.path
        //TODO: unsure how to unit test this well without making a bad test
        if (page.path === Routes.CLAIM.RECENT_EMPLOYERS)
          return areImportedEmployersValid(claimFormValues)
        return page.validationSchema.isValidSync(
          prepareDataForValidation(claimFormValues)
        )
      })
      setContinuePath(continuePage)
    }
  }, [claimFormValues])

  return { continuePath }
}
