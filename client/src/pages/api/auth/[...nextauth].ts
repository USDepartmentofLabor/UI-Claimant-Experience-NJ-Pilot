import NextAuth, { NextAuthOptions } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import { SIGN_OUT_REDIRECT } from 'utils/signout/cognitoSignOut'
import { formatUserPoolDate } from 'utils/date/format'
import { JWT } from 'next-auth/jwt'
import { REFRESH_TOKEN_ERROR } from 'constants/errors'

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
const SESSION_MAX_MINUTES = 30

async function refreshAccessToken(token: JWT) {
  try {
    const clientId = process.env.COGNITO_CLIENT_ID || ''
    const clientSecret = process.env.COGNITO_CLIENT_SECRET || ''
    const refreshToken = token.refreshToken || ''

    const urlParams = new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })

    const url = `${process.env.COGNITO_DOMAIN}/oauth2/token?${urlParams}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      method: 'POST',
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    token.accessToken = refreshedTokens.access_token
    token.accessTokenExpires = Date.now() + refreshedTokens.expires_in * 1000
    token.refreshToken = refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
    return token
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: REFRESH_TOKEN_ERROR,
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || '',
      clientSecret: process.env.COGNITO_CLIENT_SECRET || '',
      issuer: process.env.COGNITO_ISSUER,
      checks: 'nonce',
      authorization: {
        params: {
          identity_provider: process.env.COGNITO_IDENTITY_PROVIDER_NAME,
        },
      },
    }),
  ],
  session: {
    maxAge: SESSION_MAX_MINUTES * 60,
  },
  callbacks: {
    async jwt({ token, account, profile }) {
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

      if (account) {
        token.accessToken = account.access_token
        if (account.expires_at) {
          token.accessTokenExpires = account.expires_at * 1000
        }
        token.refreshToken = account.refresh_token
        return token
      }

      // Ensure token has access token expiration set
      token.accessTokenExpires = token.accessTokenExpires ?? Date.now()

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ token, session }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      if (token.whoAmI) {
        session.whoAmI = token.whoAmI
      }
      if (token.error) {
        session.error = token.error
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
