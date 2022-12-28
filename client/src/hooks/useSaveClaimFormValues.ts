import { ClaimantInput, Employer } from 'types/claimantInput'
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
    const appendedClaimFormValues = await appendValuesToClaimFormContext(values)
    await saveClaimFormValues(appendedClaimFormValues)
  }

  const appendValuesToClaimFormContext = async (
    values: Partial<ClaimantInput>
  ) => {
    return {
      ...claimFormValues,
      ...values,
    }
  }

  const modifyEmployerAndSaveClaimFormValues = async (
    values: Employer,
    index: string
  ) => {
    const modifiedClaimFormValues = { ...claimFormValues }

    // Ensure a valid index and do nothing if the index is invalid
    if (
      (claimFormValues?.employers &&
        claimFormValues.employers.length < parseInt(index)) ||
      (!claimFormValues?.employers && parseInt(index) !== 0)
    )
      return

    if (!modifiedClaimFormValues.employers) {
      modifiedClaimFormValues.employers = []
      modifiedClaimFormValues.employers[parseInt(index)] = values
    } else {
      modifiedClaimFormValues.employers[parseInt(index)] = values
    }

    await saveClaimFormValues(modifiedClaimFormValues)
  }

  return {
    appendValuesToClaimFormContext,
    appendAndSaveClaimFormValues,
    modifyEmployerAndSaveClaimFormValues,
  }
}
