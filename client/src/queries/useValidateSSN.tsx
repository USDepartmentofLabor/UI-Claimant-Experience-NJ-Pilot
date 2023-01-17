import { useMutation } from 'react-query'
// import serverHttpclient from 'utils/http/serverHttpClient'
// import { AxiosError, AxiosResponse } from 'axios'
/**
 * todo make
 */
// TODO - remove this delay function when adding api call
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const validateSSN = (ssn: string) => {
  console.log('pretending to validate ssn ', ssn)
  return delay(5000)
  // TODO - send post here instead
}

export const useValidateSSN = () => {
  return useMutation((ssnValue: string) => validateSSN(ssnValue), {
    onSuccess: () => {
      console.log('valid ssn')
    },
    onError: () => {
      console.log('SSN through error')
    },
  })
}
