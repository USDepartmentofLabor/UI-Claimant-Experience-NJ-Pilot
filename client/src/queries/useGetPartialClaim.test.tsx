import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useGetPartialClaim } from './useGetPartialClaim'
import serverHttpClient from 'utils/http/serverHttpClient'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { WhoAmI } from '../types/claimantInput'

jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)

jest.mock('utils/http/serverHttpClient')
const mockedGet = serverHttpClient.get as jest.Mock & typeof serverHttpClient

jest.mock('next-auth/react')
const mockUseSession = useSession as jest.Mock
mockUseSession.mockImplementation()

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
  const whoAmI: WhoAmI = {
    firstName: 'Hermione',
    lastName: 'Granger',
    birthdate: '2000-12-22',
    email: 'test@example.com',
    phone: '555-555-5555',
  }
  mockUseSession.mockReturnValue({
    data: {
      user: {
        email: 'test@example.com',
      },
      whoAmI,
    },
    status: 'authenticated',
  })

  it('calls the query and gets back data', async () => {
    mockedGet.mockResolvedValueOnce({ data: getData })

    const { result } = renderHook(() => useGetPartialClaim(), {
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

    const { result } = renderHook(() => useGetPartialClaim(), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toEqual(true))

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual({})
  })
})
