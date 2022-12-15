import { signIn, useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { REFRESH_TOKEN_ERROR } from 'constants/errors'

type ActiveSessionHandlerProps = {
  children: ReactNode
}
// const getTimeOut = () => {
//   return new Date(Date.now() + 5 * 60000)
// } __REMOVE
export const ActiveSessionHandler = ({
  children,
}: ActiveSessionHandlerProps) => {
  const session = useSession()

  const { error } = session.data || {}

  const handleRefreshTokenError = () => {
    void signIn('cognito')
  }

  useEffect(() => {
    if (error === REFRESH_TOKEN_ERROR) {
      handleRefreshTokenError()
    }
  }, [error])

  return <>{children}</>
}
