import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useValidateSSN } from './useValidateSsn'

const wrapper = ({ children }: any) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('use validateSSN', () => {
  it('calls the onSuccess callback if the ssn was validated', async () => {
    const hook = renderHook(() => useValidateSSN(), { wrapper })
    await act(async () => {
      hook.result.current.mutate('123-12-1234')
    })
    await waitFor(() => expect(hook.result.current.isSuccess).toEqual(true), {
      timeout: 6000,
    })
  })
})
