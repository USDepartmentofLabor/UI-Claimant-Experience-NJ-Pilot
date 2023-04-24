import { useMutation } from 'react-query'
import { Claim } from 'types/Claim'
import serverHttpClient from 'utils/http/serverHttpClient'
import { APIResponseType } from 'types/ResponseTypes'

const savePartialClaim = (claim: Partial<Claim>) => {
  return serverHttpClient.post<APIResponseType>('/partial-claim', claim)
}

export const useSavePartialClaim = () => {
  return useMutation((claim: Partial<Claim>) => savePartialClaim(claim), {
    onSuccess: () => {
      //This is where you will update the get partial claim query
      //Should update the useGetPartialClaim result
      console.log('Claim was successfully saved')
    },
    onError: () => {
      console.log('Failed to save claim')
    },
  })
}
