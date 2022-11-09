// https://next-auth.js.org/getting-started/typescript

import {
  DefaultSession,
  JWT as NextAuthJWT,
  Profile as NextAuthProfile,
} from 'next-auth'
import { WhoAmI } from 'types/claimantInput'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string
    whoAmI?: WhoAmI
  }

  interface Profile extends NextAuthProfile {
    given_name?: string
    family_name?: string
    birthdate?: string
    'custom:phone_unformatted': string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    accessToken?: string
    whoAmI?: WhoAmI
  }
}
