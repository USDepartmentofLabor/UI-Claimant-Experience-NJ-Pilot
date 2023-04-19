import { renderHook, waitFor } from '@testing-library/react'
import { useVerifiedAddress } from './useVerifiedAddress'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AddressInput } from '../types/claimantInput'
import {
  CORRECTED_ADDRESS,
  NO_ADDRESS_MATCH,
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
const successResponseContent = {
  address: {
    address: '1234 E MICHAEL SCOTT ST',
    address2: 'DUNDER MIFFLIN STE',
    city: 'SCRANTON',
    state: 'PA',
    zipcode: '18510-1234',
  },
  validationSummary: CORRECTED_ADDRESS,
}

const successResponse = {
  data: successResponseContent,
  status: 200,
}
const noMatchResponse = {
  data: {
    validationSummary: NO_ADDRESS_MATCH,
  },
  status: 200,
}
describe('use verified address query works as expected', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset()
  })
  it('calls the query and gets back data', async () => {
    mockedAxios.post.mockResolvedValueOnce(successResponse)

    const { result } = renderHook(
      () => useVerifiedAddress(requestParams, { enabled: true }),
      {
        wrapper,
      }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toEqual(true)
      expect(result.current.data).toEqual(successResponseContent)
    })
  })

  it('calls the query and gets back the expected NO MATCH error', async () => {
    mockedAxios.post.mockResolvedValueOnce(noMatchResponse)

    const { result } = renderHook(
      () => useVerifiedAddress(requestParams, { enabled: true }),
      {
        wrapper,
      }
    )
    await waitFor(() => {
      expect(result.current.isSuccess).toEqual(true)
      expect(result.current.data).toEqual({
        validationSummary: NO_ADDRESS_MATCH,
      })
    })
  })
})
