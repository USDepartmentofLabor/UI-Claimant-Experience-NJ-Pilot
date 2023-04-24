import { useQuery } from 'react-query'
import axios, { AxiosError, AxiosResponse } from 'axios'

const getBetaTestReview = async () => {
  return await axios.get('/api/beta-test-review')
}

export const useGetBetaTestReview = () => {
  return useQuery<AxiosResponse<any, any> | undefined, AxiosError<any>>(
    'getBetaTestReview',
    () => getBetaTestReview(),
    {
      enabled: false,
    }
  )
}
