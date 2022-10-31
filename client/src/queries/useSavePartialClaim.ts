import { useMutation } from 'react-query'
import { Claim } from 'types/Claim'
import httpclient from 'utils/httpclient'
import { APIResponseType } from '../types/ResponseTypes'

const savePartialClaim = (claim: Partial<Claim>) => {
  return httpclient.post<APIResponseType>('/intake-api/partial-claim', claim, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const useSavePartialClaim = () => {
  return useMutation((claim: Partial<Claim>) => savePartialClaim(claim), {
    onSuccess: () => {
      //This is where you will update the get partial claim query
      //Should update the useGetPartialClaim result
      console.log('Looks like the partial claim API was implemented! We saved!')
    },
    onError: () => {
      console.log('The partial claim API was not implemented :(')
    },
  })
}
