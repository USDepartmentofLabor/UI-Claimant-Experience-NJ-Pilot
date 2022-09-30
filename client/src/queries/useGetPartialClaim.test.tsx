import { renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useGetPartialClaim } from './useGetPartialClaim'
import httpclient from '../utils/httpclient'
import axios from 'axios'

jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)

jest.mock('utils/httpclient')
const mockedGet = httpclient.get as jest.Mock & typeof httpclient

const wrapper = ({ children }: any) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

const getData = { test: 'success' }

beforeEach(() => {
  mockedGet.mockReset()
})

describe('use get partial claim', () => {
  it('calls the query and gets back data', async () => {
    mockedGet.mockResolvedValueOnce({ data: getData })

    const { result, waitFor } = renderHook(() => useGetPartialClaim(), {
      wrapper,
    })

    await waitFor(() => result.current.isSuccess)

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(getData)
  })

  it('calls the query and gets nothing back if there was a 404 error', async () => {
    jest.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)

    mockedGet.mockImplementationOnce(() => {
      throw { response: { status: 404 } }
    })

    const { result, waitFor } = renderHook(() => useGetPartialClaim(), {
      wrapper,
    })

    await waitFor(() => result.current.isSuccess)

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual({})
  })
})
