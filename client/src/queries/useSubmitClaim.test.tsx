import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Claim } from 'types/Claim'
import { useSubmitClaim } from './useSubmitClaim'

jest.mock('utils/http/serverHttpClient', () => ({
  post: jest.fn().mockImplementation((url, claim: Claim) => {
    if (claim.email === 'good data') {
      return true
    } else {
      throw new Error('bad data')
    }
  }),
}))

const wrapper = ({ children }: any) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('use submit complete claim', () => {
  it('calls the onSuccess callback if the completed claim was successfully submitted', async () => {
    const hook = renderHook(() => useSubmitClaim(), { wrapper })
    hook.result.current.mutate({ email: 'good data' })
  })
})
