import { ClaimantInput } from 'types/claimantInput'
import { createContext } from 'react'

export type ClaimFormContextType = {
  claimFormValues?: ClaimantInput
  setClaimFormValues: (formData: Partial<ClaimantInput>) => void
  maskSensitiveData?: boolean
  hideEditUrl?: boolean
}

export const ClaimFormContext = createContext<ClaimFormContextType>(
  {} as ClaimFormContextType
)
