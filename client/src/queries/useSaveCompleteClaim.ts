import { useMutation } from 'react-query'
import { Claim } from 'types/Claim'
import httpclient from 'utils/http/httpclient'
import { APIResponseType } from '../types/ResponseTypes'

const saveCompleteClaim = (claim: Partial<Claim>) => {
  return httpclient.post<APIResponseType>('/intake-api/complete-claim', claim, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const useSaveCompleteClaim = () => {
  return useMutation((claim: Partial<Claim>) => saveCompleteClaim(claim))
}
