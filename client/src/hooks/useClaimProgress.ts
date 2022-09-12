import { ClaimantInput } from 'types/claimantInput'
import { useEffect, useState } from 'react'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'

export const useClaimProgress = (
  values: ClaimantInput,
  submitCount: number
) => {
  const [continuePath, setContinuePath] = useState(Routes.HOME)
  useEffect(() => {
    let continuePage = ''
    pageDefinitions.every((page) => {
      continuePage = page.path
      return page.validationSchema.isValidSync(values)
    })
    setContinuePath(continuePage)
  }, [submitCount])
  return { continuePath }
}
