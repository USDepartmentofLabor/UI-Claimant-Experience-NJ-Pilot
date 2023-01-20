import { useMutation } from 'react-query'
// TODO -uncomment these when adding api call
// import serverHttpclient from 'utils/http/serverHttpClient'
// import { AxiosError, AxiosResponse } from 'axios'

// TODO - remove this delay function when adding api call
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const validateSSN = async (ssn: string) => {
  console.log('simulating validate ssn api call', ssn)
  await delay(1000)
  return { data: 'success', status: 200 }
  // TODO - send post here instead
}

export const useValidateSSN = () => {
  return useMutation(validateSSN)
}
