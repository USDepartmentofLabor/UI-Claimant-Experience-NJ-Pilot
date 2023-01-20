import { AxiosError } from 'axios'
import axios from 'axios'
import { useQuery } from 'react-query'
import serverHttpClient from 'utils/http/serverHttpClient'
import { RecentEmployersResponseType } from 'types/ResponseTypes'

const getRecentEmployers = async () => {
  try {
    const { data } = await serverHttpClient.get<RecentEmployersResponseType>(
      '/recent-employers',
      {
        headers: { 'X-DOL': 'axios' },
      }
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const errorResponse: RecentEmployersResponseType = []
      return errorResponse
    }

    throw error
  }
}

export const useGetRecentEmployers = () => {
  return useQuery<RecentEmployersResponseType, AxiosError>(
    'getRecentEmployers',
    () => getRecentEmployers()
  )
}
