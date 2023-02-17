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
    const appendedClaimFormValues = appendValuesToClaimFormContext(values)
    await saveClaimFormValues(appendedClaimFormValues)
  }

  const appendValuesToClaimFormContext = (values: Partial<ClaimantInput>) => {
    const merged = {
      ...claimFormValues,
      ...values,
    }
    return merged
  }

  const employerDoesNotExist = (index: string) =>
    (claimFormValues?.employers &&
      claimFormValues.employers.length < parseInt(index)) ||
    (!claimFormValues?.employers && parseInt(index) !== 0)

  const deleteEmployerAndSaveClaimFormValues = async (index: string) => {
    const modifiedClaimFormValues = { ...claimFormValues }

    if (employerDoesNotExist(index)) return

    if (modifiedClaimFormValues.employers) {
      modifiedClaimFormValues.employers.splice(parseInt(index), 1)
      await saveClaimFormValues(modifiedClaimFormValues)
    }
    return claimFormValues
  }

  const modifyEmployerAndSaveClaimFormValues = async (
    values: Employer,
    index: string
  ) => {
    const modifiedClaimFormValues = { ...claimFormValues }

    // Ensure a valid index and do nothing if the index is invalid
    if (employerDoesNotExist(index)) return

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
    deleteEmployerAndSaveClaimFormValues,
  }
}
