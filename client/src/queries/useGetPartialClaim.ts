import axios from 'axios'
import { AxiosError } from 'axios'
import { useQuery } from 'react-query'
import httpclient from '../utils/httpclient'

import { PartialClaimResponseType } from '../types/ResponseTypes'

const getPartialClaim = async () => {
  try {
    const { data } = await httpclient.get<PartialClaimResponseType>(
      '/intake-api/partial-claim',
      {
        withCredentials: false,
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
  return useQuery<PartialClaimResponseType, AxiosError>('getPartialClaim', () =>
    getPartialClaim()
  )
}
