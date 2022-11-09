import serverHttpClient from 'utils/http/serverHttpClient'

jest.mock('next-auth/react')
import { getSession, signOut } from 'next-auth/react'
import { SIGN_OUT_REDIRECT } from '../signout/cognitoSignOut'

const mockGetSession = getSession as jest.Mock
const mockSignOut = signOut as jest.Mock

describe('The Server HTTP Client', () => {
  describe('request interceptors', () => {
    it.each([undefined, {}])(
      'adds authorization headers when accessToken is in the session',
      async (headers) => {
        const tokenValue = 'fakeToken'
        mockGetSession.mockImplementation(() => ({
          accessToken: tokenValue,
        }))

        const result =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await serverHttpClient.interceptors.request.handlers[0].fulfilled({
            headers,
          })

        expect(result.headers).toHaveProperty(
          'Authorization',
          `Bearer ${tokenValue}`
        )
      }
    )

    it('Does not add authorization headers when accessToken is missing', async () => {
      mockGetSession.mockImplementation(() => ({}))

      const result =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await serverHttpClient.interceptors.request.handlers[0].fulfilled({
          headers: {},
        })

      expect(result.headers).not.toHaveProperty('Authorization')
    })

    it('Passes errors through on rejection', () => {
      const fakeError = {
        request: {
          status: 401,
        },
      }

      const result =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        serverHttpClient.interceptors.request.handlers[0].rejected(fakeError)

      expect(result).rejects.toMatchObject(fakeError)
    })
  })
  describe('response interceptor', () => {
    it('Signs the user out and redirects them to the sign in page when the backend responds with a 401 error', async () => {
      mockSignOut.mockClear()

      const fakeError = {
        response: {
          status: 401,
        },
      }

      const error =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        serverHttpClient.interceptors.response?.handlers[0].rejected(fakeError)
      await expect(error).rejects.toEqual(fakeError)

      expect(mockSignOut).toHaveBeenCalledWith({
        callbackUrl: SIGN_OUT_REDIRECT,
      })
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })

    it('Simply returns a rejected promise as usual when the status is not 401', async () => {
      mockSignOut.mockClear()

      const fakeError = {
        response: {
          status: 404,
        },
      }

      const error =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        serverHttpClient.interceptors.response?.handlers[0].rejected(fakeError)
      await expect(error).rejects.toEqual(fakeError)

      expect(mockSignOut).toHaveBeenCalledTimes(0)
    })

    it('Returns the response if fulfilled', () => {
      mockSignOut.mockClear()

      const fakeResponse = { status: 200 }

      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        serverHttpClient.interceptors.response?.handlers[0].fulfilled(
          fakeResponse
        )
      ).toEqual(fakeResponse)

      expect(mockSignOut).toHaveBeenCalledTimes(0)
    })
  })
})
