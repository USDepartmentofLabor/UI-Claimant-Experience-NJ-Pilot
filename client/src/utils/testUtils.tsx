import { ReactNode } from 'react'
import { ClaimFormContext } from '../contexts/ClaimFormContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ClaimantInput } from '../types/claimantInput'

type WrappingProvidersProps = {
  children: ReactNode
  claimFormValues?: ClaimantInput
}
export const WrappingProviders = ({
  children,
  claimFormValues = {},
}: WrappingProvidersProps) => {
  return (
    <ClaimFormContext.Provider
      value={{
        claimFormValues: claimFormValues,
        setClaimFormValues: jest.fn(),
      }}
    >
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </ClaimFormContext.Provider>
  )
}
