import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useGetRecentEmployers } from 'queries/useGetRecentEmployers'
import serverHttpClient from 'utils/http/serverHttpClient'
import axios from 'axios'

jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)

jest.mock('utils/http/serverHttpClient')
const mockedGet = serverHttpClient.get as jest.Mock & typeof serverHttpClient

const wrapper = ({ children }: any) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

const getData = [
  { employer_name: 'Darth Vadar', address: 'death star' },
  { employer_name: 'Emperor Palpatin', address: 'Coruscant' },
]

beforeEach(() => {
  mockedGet.mockReset()
})

describe('use get imported employers', () => {
  it('calls the query and gets back data', async () => {
    mockedGet.mockResolvedValueOnce({ data: getData })

    const { result } = renderHook(() => useGetRecentEmployers(), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toEqual(true))
    expect(result.current.isSuccess).toBeTruthy()
    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(getData)
  })

  it('calls the query and gets nothing back if there was a 404 error', async () => {
    jest.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)

    mockedGet.mockImplementationOnce(() => {
      throw { response: { status: 404 } }
    })

    const { result } = renderHook(() => useGetRecentEmployers(), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toEqual(true))

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual([])
  })
})
