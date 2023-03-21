import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { renderToString } from 'react-dom/server'
import { getServerSession, Session } from 'next-auth'
import { ReviewReport } from 'components/review/ReviewReport/ReviewReport'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import https from 'https'

const serverUrl = process.env.SERVER_BASE_URL ?? 'http://localhost:8080'

const httpClientOptions = {
  baseURL: `${serverUrl}/intake-api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}

const httpClient = process.env.IGNORE_CERT_FAILURES
  ? axios.create({
      ...httpClientOptions,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
  : axios.create(httpClientOptions)

export const getCompleteClaim = async (session: Session | null) => {
  try {
    const res = await httpClient.get(`/complete-claim`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-DOL': 'axios',
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })
    return res.data
  } catch (error) {
    console.error('Error getting complete claim:', error)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
): Promise<any> {
  const session = await getServerSession(req, res, authOptions)
  const data = await getCompleteClaim(session)
  if (data && session) {
    const reviewData = {
      claimFormValues: data,
      maskSensitiveData: false,
      setClaimFormValues: () => undefined,
      hideEditUrl: true,
    }
    const personalReviewHtml = renderToString(<ReviewReport {...reviewData} />)
    const html = `<!DOCTYPE html>${personalReviewHtml}`

    try {
      const betaResponse = await httpClient.post(`/beta-test/submit`, html, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'text/html',
        },
      })
      return res.status(betaResponse.status).send(betaResponse.statusText)
    } catch (error) {
      res.setHeader('Content-Type', 'text/plain')
      if (axios.isAxiosError(error)) {
        return res
          .status(error.response?.status || 500)
          .send(error.response?.data || error.message)
      }
      return res.status(500).send('An unknown error occurred ')
    }
  } else {
    return res.status(400).send(data)
  }
}
