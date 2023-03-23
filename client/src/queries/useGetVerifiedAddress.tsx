import { useQuery } from 'react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { AddressInput } from '../types/claimantInput'

const getVerifiedAddress = async (address: AddressInput) => {
  let addressParams = convertJSONAddressToURLParams(address)
  return await axios.get('/api/services/verify-address?' + addressParams)
}

export const useGetVerifiedAddress = (address: AddressInput) => {
  return useQuery<AxiosResponse<any, any> | undefined, AxiosError<any>>(
    'getVerifiedAddress',
    () => getVerifiedAddress(address)
  )
}

const convertJSONAddressToURLParams = (params: AddressInput): string => {
  let urlParams = new URLSearchParams(params).toString()
  urlParams = urlParams.replace('address', 'street')
  urlParams = urlParams.replace('address2', 'street2')
  urlParams = urlParams.replace('zipcode', 'zip')
  return urlParams
}
