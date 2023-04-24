import { useQuery } from 'react-query'
import {
  OccupationsSearchRequest,
  OccupationsSearchResponse,
} from 'pages/api/occupations/search'
import axios from 'axios'

async function search(request: OccupationsSearchRequest) {
  const { data } = await axios.post<OccupationsSearchResponse>(
    '/api/occupations/search',
    request
  )

  return data.occupations
}

export function useOccupationsSearch(data: OccupationsSearchRequest) {
  const queryKey = ['occupations-search', data.job_title, data.job_description]

  return useQuery(queryKey, () => search(data), {
    enabled: !!data.job_title && !!data.job_description,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
