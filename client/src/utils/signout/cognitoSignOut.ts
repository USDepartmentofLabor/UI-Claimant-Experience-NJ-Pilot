import { signOut } from 'next-auth/react'

export const SIGN_OUT_REDIRECT = 'cognitoSignOut'

export const cognitoSignOut = () => signOut({ callbackUrl: SIGN_OUT_REDIRECT })
