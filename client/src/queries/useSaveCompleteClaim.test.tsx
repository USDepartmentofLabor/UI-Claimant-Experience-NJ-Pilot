import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Claim } from 'types/Claim'
import { useSaveCompleteClaim } from './useSaveCompleteClaim'

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

describe('use save complete claim', () => {
  it('calls the onSuccess callback if the completed claim was successfully saved', async () => {
    const hook = renderHook(() => useSaveCompleteClaim(), { wrapper })
    hook.result.current.mutate({ email: 'good data' })

    await waitFor(() => expect(hook.result.current.isSuccess).toEqual(true))
  })
})
