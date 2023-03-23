import { useQuery } from 'react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { AddressInput } from '../types/claimantInput'

const getVerifiedAddress = async (address: AddressInput) => {
  // POST so that the JSON Address can be sent directly, keeping param conversion logic in the API handler
  return await axios.post('/api/services/verify-address', address)
}

export const useGetVerifiedAddress = (address: AddressInput) => {
  return useQuery<AxiosResponse<any, any> | undefined, AxiosError<any>>(
    'getVerifiedAddress',
    () => getVerifiedAddress(address)
  )
}
