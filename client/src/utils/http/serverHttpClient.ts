import axios from 'axios'
import { getSession } from 'next-auth/react'
import { cognitoSignOut } from '../signout/cognitoSignOut'

const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL ?? 'http://localhost:8080'

const serverHttpClient = axios.create({
  baseURL: `${serverUrl}/intake-api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

serverHttpClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session?.accessToken) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

serverHttpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await cognitoSignOut()
    }
    // Should never reach this point if the redirect is working and is a 401 error
    throw error
  }
)

export default serverHttpClient
