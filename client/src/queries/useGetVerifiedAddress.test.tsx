import { renderHook, waitFor } from '@testing-library/react'
import { useGetVerifiedAddress } from './useGetVerifiedAddress'
import { QueryClient, QueryClientProvider } from 'react-query'

const mockAxiosGet = jest
  .fn()
  .mockImplementation(() => ({ data: { status: 200 } }))
jest.mock('axios', () => ({
  get: mockAxiosGet,
  isAxiosError: () => true,
}))

const wrapper = ({ children }: any) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}
const requestParams = {
  address: '1234 Michael Scott St',
  address2: 'Dunder Mifflin suite',
  city: 'Scranton',
  state: 'PA',
  zipcode: '18510',
}
const getData = {
  address: {
    address: '1234 E Michael Scott St',
    address2: 'Dunder Mifflin Suite',
    city: 'Scranton',
    state: 'PA',
    zipcode: '18510-1234',
  },
  errorSummary: '',
}
describe('use get verified address', () => {
  it('calls the query and gets back data', async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: getData })

    const { result } = renderHook(() => useGetVerifiedAddress(requestParams), {
      wrapper,
    })
    await waitFor(() => expect(result.current.isSuccess).toEqual(true))
    expect(mockAxiosGet).toHaveBeenCalledTimes(0)
    expect(result.current.data).not.toEqual(getData)
    const refetchResult = await result.current.refetch()

    expect(refetchResult.isSuccess).toBeTruthy()
  })
})
