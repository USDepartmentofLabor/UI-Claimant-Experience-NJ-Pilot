import { useQuery } from 'react-query'
import axios from 'axios'
import { AddressInput } from 'types/claimantInput'

const getVerifiedAddress = async (address: AddressInput | undefined) => {
  //TODO MRH discuss if better ot use POST and send object to service or do the conversion of params here or sooner
  return await axios.post('/api/services/verify-address', address)
}

export const useGetVerifiedAddress = (address: AddressInput | undefined) => {
  return useQuery(['getVerifiedAddress', address], () =>
    getVerifiedAddress(address)
  )
}
