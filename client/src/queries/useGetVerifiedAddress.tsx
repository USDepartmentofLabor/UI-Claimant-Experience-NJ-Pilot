import { useQuery } from 'react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { AddressInput } from '../types/claimantInput'
import { add } from 'unload'

const getVerifiedAddress = async (address: AddressInput | undefined) => {
  return await axios.get('/api/services/verify-address?' + address)
}

export const useGetVerifiedAddress = (address: AddressInput | undefined) => {
  //using the first line of the address as a key to differentiate requests and responses
  return useQuery<AxiosResponse<any, any> | undefined, AxiosError<any>>(
    address?.address || 'getVerifiedAddress',
    () => getVerifiedAddress(address)
  )
}
