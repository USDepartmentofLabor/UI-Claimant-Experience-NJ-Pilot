import { useQuery } from 'react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { AddressInput } from '../types/claimantInput'

const getVerifiedAddress = async (address: AddressInput | undefined) => {
  const addressParams = convertJSONAddressToURLParams(address)
  const response = await axios.get(
    '/api/services/verify-address?' + addressParams
  )
  return response
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
