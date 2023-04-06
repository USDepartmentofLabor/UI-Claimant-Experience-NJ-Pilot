import { renderHook, waitFor } from '@testing-library/react'
import { useVerifiedAddress } from './useVerifiedAddress'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AddressInput } from '../types/claimantInput'
import {
  CORRECTED_ADDRESS,
  NO_PARAMS_ERROR,
} from '../constants/api/services/verifyAddress'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const wrapper = ({ children }: any) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}
const requestParams: AddressInput = {
  address: '1234 Michael Scott St',
  address2: 'Dunder Mifflin suite',
  city: 'Scranton',
  state: 'PA',
  zipcode: '18510',
}
const successResponse = {
  response: {
    address: {
      address: '1234 E MICHAEL SCOTT ST',
      address2: 'DUNDER MIFFLIN STE',
      city: 'SCRANTON',
      state: 'PA',
      zipcode: '18510-1234',
    },
    errorSummary: CORRECTED_ADDRESS,
  },
  status: 200,
}
const emptyParamsResponse = {
  response: {
    NO_PARAMS_ERROR,
  },
  status: 200,
}
describe('use verified address query works as expected', () => {
  it('calls the query and gets back data', async () => {
    mockedAxios.post.mockResolvedValueOnce(successResponse)

    const { result } = renderHook(() => useVerifiedAddress(requestParams), {
      wrapper,
    })
    await waitFor(() => expect(result.current.isSuccess).toEqual(true))
    expect(result.current.data).toEqual(successResponse)
  })
  it('calls the query without params and gets back the expected error', async () => {
    mockedAxios.post.mockResolvedValueOnce(emptyParamsResponse)

    const { result } = renderHook(() => useVerifiedAddress(undefined), {
      wrapper,
    })
    await waitFor(() => expect(result.current.isSuccess).toEqual(true))
    expect(result.current.data).toEqual(emptyParamsResponse)
  })
})
