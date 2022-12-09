import { useContext, useEffect, useState } from 'react'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
import { prepareDataForValidation } from 'formik'
import { ClaimFormContext } from 'contexts/ClaimFormContext'

export const useClaimProgress = () => {
  const { claimFormValues } = useContext(ClaimFormContext)

  const [continuePath, setContinuePath] = useState(Routes.HOME)

  useEffect(() => {
    if (claimFormValues) {
      let continuePage = ''
      pageDefinitions.every((page) => {
        continuePage = page.path
        return page.validationSchema.isValidSync(
          prepareDataForValidation(claimFormValues)
        )
      })
      setContinuePath(continuePage)
    }
  }, [claimFormValues])

  return { continuePath }
}
