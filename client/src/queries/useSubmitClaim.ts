import { useMutation } from 'react-query'
import serverHttpclient from 'utils/http/serverHttpClient'
import { ClaimantInput } from 'types/claimantInput'
import { AxiosError, AxiosResponse } from 'axios'

type SubmitClaimResponse = string

const submitClaim = (claim: Partial<ClaimantInput>) => {
  return serverHttpclient.post<SubmitClaimResponse>('/submit', claim, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const useSubmitClaim = () => {
  return useMutation<
    AxiosResponse<SubmitClaimResponse>,
    AxiosError<SubmitClaimResponse>,
    Partial<ClaimantInput>
  >(submitClaim)
}
