import { ScreenerInput } from 'types/claimantInput'
import { createContext } from 'react'

export type IntakeAppContextType = {
  screenerInput?: ScreenerInput
  setScreenerInput: (screenerInput: ScreenerInput) => void
  ssn?: string
  setSsn: (ssn: string) => void
}

export const IntakeAppContext = createContext<IntakeAppContextType>(
  {} as IntakeAppContextType
)
