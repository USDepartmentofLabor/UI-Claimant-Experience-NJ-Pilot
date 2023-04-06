import { useQuery } from 'react-query'
import axios from 'axios'
import { AddressInput } from 'types/claimantInput'

const getVerifiedAddress = async (address: AddressInput | undefined) => {
  return await axios.post('/api/services/verify-address', address)
}

export const useVerifiedAddress = (address: AddressInput | undefined) => {
  return useQuery(['getVerifiedAddress', address], () =>
    getVerifiedAddress(address)
  )
}
