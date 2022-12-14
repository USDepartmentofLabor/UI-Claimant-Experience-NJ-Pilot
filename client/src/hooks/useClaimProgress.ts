import { useContext, useEffect, useState } from 'react'
import {
  PageDefinition,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
import { prepareDataForValidation } from 'formik'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { yupEditEmployer } from 'components/form/EditEmployer/EditEmployer'
import { ClaimantInput } from 'types/claimantInput'

// seperated the logic here for unit testing
export const isEmployerArrayValid = (
  page: PageDefinition,
  values: ClaimantInput
) => {
  return (
    page.validationSchema.isValidSync(prepareDataForValidation(values)) &&
    (values.employers
      ? values.employers.every(
          (employer) =>
            !employer.is_employer ||
            yupEditEmployer.isValidSync(prepareDataForValidation(employer))
        )
      : true)
  )
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
          return isEmployerArrayValid(page, claimFormValues)
        return page.validationSchema.isValidSync(
          prepareDataForValidation(claimFormValues)
        )
      })
      setContinuePath(continuePage)
    }
  }, [claimFormValues])

  return { continuePath }
}
