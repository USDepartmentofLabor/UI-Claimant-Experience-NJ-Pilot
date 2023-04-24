import { useMutation } from 'react-query'
import serverHttpClient from 'utils/http/serverHttpClient'
import { AxiosError, AxiosResponse } from 'axios'
import { ClaimantInput } from 'types/claimantInput'

type CompleteClaimResponse = string

const saveCompleteClaim = (claim: Partial<ClaimantInput>) => {
  return serverHttpClient.post<CompleteClaimResponse>(
    '/complete-claim',
    claim,
    {
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export const useSaveCompleteClaim = () => {
  return useMutation<
    AxiosResponse<CompleteClaimResponse>,
    AxiosError<CompleteClaimResponse>,
    Partial<ClaimantInput>
  >(saveCompleteClaim)
}
