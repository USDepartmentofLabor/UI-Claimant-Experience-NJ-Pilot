import { useMutation } from 'react-query'
import { Claim } from 'types/Claim'
import serverHttpClient from 'utils/http/serverHttpClient'
import { APIResponseType } from 'types/ResponseTypes'

const saveCompleteClaim = (claim: Partial<Claim>) => {
  return serverHttpClient.post<APIResponseType>('/complete-claim', claim, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const useSaveCompleteClaim = () => {
  return useMutation((claim: Partial<Claim>) => saveCompleteClaim(claim))
}
