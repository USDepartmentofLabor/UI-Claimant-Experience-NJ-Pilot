import { useQuery } from 'react-query'
import axios from 'axios'
import { AddressInput } from 'types/claimantInput'

async function getVerifiedAddress(address: AddressInput) {
  const responseData = await axios.post('/api/services/verify-address', address)
  return responseData.data
}

export function useVerifiedAddress(
  address: AddressInput,
  options: { enabled: boolean }
) {
  return useQuery(
    ['getVerifiedAddress', address],
    () => getVerifiedAddress(address),
    options
  )
}
