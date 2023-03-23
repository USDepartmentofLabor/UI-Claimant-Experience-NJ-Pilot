import { ReactNode, useState } from 'react'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { IntakeAppContext } from 'contexts/IntakeAppContext'
import { ClaimantInput, ScreenerInput, SsnInput } from 'types/claimantInput'

type AppContextProvidersProps = {
  children: ReactNode
}
export const AppContextProviders = ({ children }: AppContextProvidersProps) => {
  const [screenerInput, setScreenerInput] = useState<ScreenerInput | undefined>(
    undefined
  )
  const [ssnInput, setSsn] = useState<SsnInput | undefined>(undefined)
  const [claimFormValues, setClaimFormValues] = useState<
    ClaimantInput | undefined
  >(undefined)
  console.log('in appcontextprovider: ssn is  ', ssnInput?.ssn)
  console.log('claimform values ssn ', claimFormValues?.ssn)
  return (
    <IntakeAppContext.Provider
      value={{
        screenerInput,
        setScreenerInput,
        ssnInput,
        setSsn,
      }}
    >
      <ClaimFormContext.Provider
        value={{
          claimFormValues,
          setClaimFormValues,
        }}
      >
        {children}
      </ClaimFormContext.Provider>
    </IntakeAppContext.Provider>
  )
}
