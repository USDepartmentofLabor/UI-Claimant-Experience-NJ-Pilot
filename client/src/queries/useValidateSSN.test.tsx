import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useValidateSSN } from './useValidateSSN'

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
    const response = await hook.result.current.mutateAsync('123-12-1234')

    await waitFor(() => expect(response.status).toEqual(200), {
      timeout: 6000,
    })
  })
})
