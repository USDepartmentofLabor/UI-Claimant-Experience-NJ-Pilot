import { useMutation } from 'react-query'
import { Claim } from 'types/Claim'
import serverHttpclient from 'utils/http/serverHttpClient'
import { APIResponseType } from 'types/ResponseTypes'

const submitClaim = (claim: Partial<Claim>) => {
  return serverHttpclient.post<APIResponseType>('/submit', claim, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const useSubmitClaim = () => {
  return useMutation((claim: Partial<Claim>) => submitClaim(claim))
}
