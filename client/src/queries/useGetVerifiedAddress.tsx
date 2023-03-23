import { useQuery } from 'react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { AddressInput } from '../types/claimantInput'

const getVerifiedAddress = async (address: AddressInput | undefined) => {
  let addressParams = convertJSONAddressToURLParams(address)
  return await axios.get('/api/services/verify-address?' + addressParams)
}

export const useGetVerifiedAddress = (address: AddressInput | undefined) => {
  //using the first line of the address as a key to differentiate requests and responses
  return useQuery<AxiosResponse<any, any> | undefined, AxiosError<any>>(
    address?.address || 'getVerifiedAddress',
    () => getVerifiedAddress(address)
  )
}

const convertJSONAddressToURLParams = (
  params: AddressInput | undefined
): string => {
  let urlParams = new URLSearchParams(params).toString()
  urlParams = urlParams.replace('address', 'street')
  urlParams = urlParams.replace('address2', 'street2')
  urlParams = urlParams.replace('zipcode', 'zip')
  return urlParams
}
