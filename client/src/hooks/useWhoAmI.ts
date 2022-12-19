import { useSession } from 'next-auth/react'
import { WhoAmI } from 'types/claimantInput'
const changeExpirationToDate = (sessionExpiration: any) => {
  if (typeof sessionExpiration === 'string') {
    return new Date(sessionExpiration)
  }
  return sessionExpiration
}
export const useWhoAmI = () => {
  const { data, status } = useSession()

  const whoAmI = data?.whoAmI as WhoAmI | undefined
  console.log('expires at received is ' + data?.expires)
  console.log('data is ' + data)
  // const sessionTemp= new Date( 'Fri, 16 Dec 2022 13:35:10 PST')
  // console.log("session temp type is "+typeof(sessionTemp))
  // const sessionExpires=undefined
  let sessionExpires = data?.expires as Date | undefined
  sessionExpires = changeExpirationToDate(sessionExpires)
  const isLoading = status === 'loading'
  return { data: whoAmI, isLoading, sessionExpires }
}
