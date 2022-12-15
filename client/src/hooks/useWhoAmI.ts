import { useSession } from 'next-auth/react'
import { WhoAmI } from 'types/claimantInput'

export const useWhoAmI = () => {
  const { data, status } = useSession()

  const whoAmI = data?.whoAmI as WhoAmI | undefined
  const expiresTemp = data?.expires as Date | undefined
  const isLoading = status === 'loading'
  return { data: whoAmI, isLoading, expiresTemp }
}
