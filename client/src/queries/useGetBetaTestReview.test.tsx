import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useGetBetaTestReview } from './useGetBetaTestReview'
import axios from 'axios'

jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)

const mockAxiosGet = jest
  .fn()
  .mockImplementation(() => ({ data: { status: 200 } }))

jest.mock('axios', () => ({
  get: jest.fn(),
  isAxiosError: () => true,
}))

const wrapper = ({ children }: any) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

const getData = { data: 200 }

beforeEach(() => {
  mockAxiosGet.mockReset()
})

describe('use get beta test review', () => {
  it('calls the query and the result is idle as expected', async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: getData })

    const { result } = renderHook(() => useGetBetaTestReview(), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isIdle).toEqual(true))
    expect(result.current.isIdle).toBeTruthy()
    expect(mockAxiosGet).toHaveBeenCalledTimes(0)
    expect(result.current.data).not.toEqual(getData)
  })

  it('calls the refetch function and the result is success as expected', async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: getData })

    const { result } = renderHook(useGetBetaTestReview, {
      wrapper,
    })

    const refetchResult = await result.current.refetch()

    expect(refetchResult.isSuccess).toBeTruthy()
  })
})
