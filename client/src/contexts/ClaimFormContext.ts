import { ClaimantInput } from 'types/claimantInput'
import { createContext } from 'react'

export type ClaimFormContextType = {
  claimFormValues?: ClaimantInput
  setClaimFormValues: (formData: ClaimantInput) => void
}

export const ClaimFormContext = createContext<ClaimFormContextType>(
  {} as ClaimFormContextType
)
