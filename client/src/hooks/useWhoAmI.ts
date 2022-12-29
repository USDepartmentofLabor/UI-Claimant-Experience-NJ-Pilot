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
  let sessionExpires = data?.expires as Date | undefined
  sessionExpires = changeExpirationToDate(sessionExpires)
  const isLoading = status === 'loading'
  return { data: whoAmI, isLoading, sessionExpires }
}
