import axios from 'axios'
import { AxiosError } from 'axios'
import { useQuery } from 'react-query'

import serverHttpClient from 'utils/http/serverHttpClient'
import { PartialClaimResponseType } from 'types/ResponseTypes'
import { useSession } from 'next-auth/react'

const getPartialClaim = async () => {
  // console.log("**performing get partial claim")
  try {
    const { data } = await serverHttpClient.get<PartialClaimResponseType>(
      '/partial-claim',
      {
        headers: { 'X-DOL': 'axios' },
      }
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const errorResponse: PartialClaimResponseType = {}
      return errorResponse
    }

    throw error
  }
}

export const useGetPartialClaim = () => {
  const session = useSession()
  return useQuery<PartialClaimResponseType, AxiosError>(
    'getPartialClaim',
    () => getPartialClaim(),
    { enabled: !!session.data?.user }
  )
}
