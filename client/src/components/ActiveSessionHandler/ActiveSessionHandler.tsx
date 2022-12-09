import { signIn, useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import { REFRESH_TOKEN_ERROR } from 'constants/errors'

type ActiveSessionHandlerProps = {
  children: ReactNode
}

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
