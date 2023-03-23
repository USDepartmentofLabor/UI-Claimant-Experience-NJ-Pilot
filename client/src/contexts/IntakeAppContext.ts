import { ScreenerInput, SsnInput } from 'types/claimantInput'
import { createContext } from 'react'

export type IntakeAppContextType = {
  screenerInput?: ScreenerInput
  setScreenerInput: (screenerInput: ScreenerInput) => void
  ssnInput?: SsnInput
  setSsn: (ssnInput: SsnInput) => void
}
///is this why? its setting to empty???
export const IntakeAppContext = createContext<IntakeAppContextType>(
  {} as IntakeAppContextType
)
