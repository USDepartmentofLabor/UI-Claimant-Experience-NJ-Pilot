import { useMutation } from 'react-query'
// import serverHttpclient from 'utils/http/serverHttpClient'
// import { AxiosError, AxiosResponse } from 'axios'

// TODO - remove this delay function when adding api call
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const validateSSN = async (ssn: string) => {
  console.log('pretending to validate ssn ', ssn)
  await delay(5000)
  console.log('returning')
  return { data: 'success', status: 200 }
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
  // return validateSSN()
}
