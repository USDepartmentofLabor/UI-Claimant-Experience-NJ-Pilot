import NextAuth, { NextAuthOptions } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import { SIGN_OUT_REDIRECT } from 'utils/signout/cognitoSignOut'
import { formatUserPoolDate } from 'utils/date/format'

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || '',
      clientSecret: process.env.COGNITO_CLIENT_SECRET || '',
      issuer: process.env.COGNITO_ISSUER,
      checks: 'nonce',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        const givenNameParts = profile.given_name?.split(' ')

        const firstName = givenNameParts?.[0] || undefined
        const lastName = profile.family_name || undefined
        const middleInitial = givenNameParts?.[1] || undefined
        const birthdate = profile.birthdate
          ? formatUserPoolDate(profile.birthdate)
          : undefined
        const email = profile.email || undefined
        const phone = profile['custom:phone_unformatted'] || undefined

        token.whoAmI = {
          firstName,
          lastName,
          middleInitial,
          birthdate,
          email,
          phone,
        }
      }

      return token
    },
    async session({ token, session }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      if (token.whoAmI) {
        session.whoAmI = token.whoAmI
      }
      return session
    },
    async redirect({ baseUrl, url }) {
      if (url === SIGN_OUT_REDIRECT) {
        const urlParams = new URLSearchParams({
          client_id: process.env.COGNITO_CLIENT_ID as string,
          logout_uri: `${process.env.NEXTAUTH_URL as string}`,
        })
        return `${process.env.COGNITO_DOMAIN}/logout?${urlParams}`
      }
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
}

export default NextAuth(authOptions)
