import { useMutation } from 'react-query'
import { Claim } from 'types/Claim'
import httpclient from 'utils/http/httpclient'
import { APIResponseType } from '../types/ResponseTypes'

const submitClaim = (claim: Partial<Claim>) => {
  return httpclient.post<APIResponseType>('/intake-api/submit', claim, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const useSubmitClaim = () => {
  return useMutation((claim: Partial<Claim>) => submitClaim(claim))
}
