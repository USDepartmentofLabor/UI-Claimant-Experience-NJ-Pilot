import { ClaimantInput } from 'types/claimantInput'
import { useEffect, useState } from 'react'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
import { prepareDataForValidation } from 'formik'

export const useClaimProgress = (
  values: ClaimantInput,
  submitCount: number
) => {
  const [continuePath, setContinuePath] = useState(Routes.HOME)
  useEffect(() => {
    let continuePage = ''
    pageDefinitions.every((page) => {
      continuePage = page.path
      return page.validationSchema.isValidSync(prepareDataForValidation(values))
    })
    setContinuePath(continuePage)
  }, [submitCount])
  return { continuePath }
}
