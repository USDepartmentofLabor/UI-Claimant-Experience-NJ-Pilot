import { renderHook } from '@testing-library/react'
import { useSavePartialClaim } from './useSavePartialClaim'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Claim } from 'types/Claim'

jest.mock('utils/http/httpclient', () => ({
  post: jest.fn().mockImplementation((url, claim: Claim) => {
    console.log('got in post mock')
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

describe('use save partial claim', () => {
  it('calls the onSuccess callback if the partial claim was successfully saved', async () => {
    const hooky = renderHook(() => useSavePartialClaim(), { wrapper })
    hooky.result.current.mutate({ email: 'good data' })

    //lost here
  })
})
