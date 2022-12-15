// https://next-auth.js.org/getting-started/typescript

import {
  DefaultSession,
  JWT as NextAuthJWT,
  Profile as NextAuthProfile,
} from 'next-auth'
import { WhoAmI } from 'types/claimantInput'
//__REMOVE__ whoami comes from jwt, i think
interface SharedProps {
  accessToken?: string
  whoAmI?: WhoAmI
  expires: Date
  error?: string
}

declare module 'next-auth' {
  interface Session extends DefaultSession, SharedProps {}

  interface Profile extends NextAuthProfile {
    given_name?: string
    family_name?: string
    birthdate?: string
    'custom:phone_unformatted': string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT, SharedProps {
    accessTokenExpires?: number
    refreshToken?: string
  }
}
