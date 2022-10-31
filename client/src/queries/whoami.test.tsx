import { PropsWithChildren, ReactNode } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import httpclient from '../utils/httpclient'
import { useWhoAmI } from './whoami'
import { WhoAmI } from 'types/claimantInput'

const whoAmI: WhoAmI = {
  firstName: 'Hermione',
  lastName: 'Granger',
  birthdate: '2000-12-22',
  ssn: '555-55-5555',
  email: 'test@example.com',
  phone: '555-555-5555',
}
jest.mock('utils/httpclient')
const mockedGet = httpclient.get as jest.Mock & typeof httpclient

describe('should use whoami', () => {
  const queryClient = new QueryClient()
  const wrapper = ({ children }: PropsWithChildren<ReactNode>) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
  it('calls the query and returns the expected data', async () => {
    mockedGet.mockResolvedValueOnce({ data: whoAmI })
    const { result, waitFor } = renderHook(() => useWhoAmI(), { wrapper })

    await waitFor(() => result.current.isSuccess)

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(whoAmI)
  })
})
