import { isAxiosError } from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { Occucoder, SOCOccupation } from 'services/Occucoder'

/**
 * Find occupation codes
 * @param req.body.job_title
 * @param req.body.job_description
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SOCOccupation[] | string>
) {
  const session = await getServerSession(req, res, authOptions)
  const occucoder = new Occucoder({
    baseUrl: process.env.OCCUCODER_URL as string,
  })

  if (!session) return res.status(401).send('Unauthorized')

  if (!req.body.job_title || req.body.job_title.trim().length === 0) {
    return res.status(401).send('A job title is required.')
  }

  try {
    const occupations = await occucoder.getOccupationCodes(req.body)
    return res.status(200).json(occupations)
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined
    const message = isAxiosError(error)
      ? error.response?.data
      : 'Internal Server Error'

    return res.status(status ?? 500).send(message)
  }
}
