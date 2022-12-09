import { ClaimantInput } from 'types/claimantInput'
import { useSavePartialClaim } from 'queries/useSavePartialClaim'
import { useSaveCompleteClaim } from 'queries/useSaveCompleteClaim'
import { useSubmitClaim } from 'queries/useSubmitClaim'
import { useContext } from 'react'
import { ClaimFormContext } from 'contexts/ClaimFormContext'

export const useSaveClaimFormValues = () => {
  const { claimFormValues, setClaimFormValues } = useContext(ClaimFormContext)
  const savePartialClaim = useSavePartialClaim()
  const saveCompleteClaim = useSaveCompleteClaim()
  const submitClaim = useSubmitClaim()

  const saveClaimFormValues = async (values: ClaimantInput) => {
    saveCompleteClaim.reset()
    submitClaim.reset()
    const saveResult = await savePartialClaim.mutateAsync(values)
    if (saveResult.status === 200) setClaimFormValues(values)
  }

  const appendAndSaveClaimFormValues = async (
    values: Partial<ClaimantInput>
  ) => {
    const appendedClaimFormValues = {
      ...claimFormValues,
      ...values,
    }
    await saveClaimFormValues(appendedClaimFormValues)
  }

  return {
    appendAndSaveClaimFormValues,
  }
}
