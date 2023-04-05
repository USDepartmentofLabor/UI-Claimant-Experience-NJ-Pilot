import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { isAxiosError } from 'axios'
import { AddressInput } from 'types/claimantInput'
import {
  NO_PARAMS_ERROR,
  NO_SESSION_ERROR,
} from 'constants/api/services/verifyAddress'
import { Accumail, AddressVerificationResponse } from 'services/Accumail'

/**
 * Check the user-entered address and use service to check if USPS provides potential corrections or a match
 * Method: POST
 * @param req.query.AddressInput
 * @field req.query.AddressInput.address
 * @field req.query.AddressInput.address2
 * @field req.query.AddressInput.city
 * @field req.query.AddressInput.state
 * @field req.query.AddressInput.zipcode
 */ export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressVerificationResponse | string>
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).send(NO_SESSION_ERROR)
  if (!Object.keys(req.body).length)
    return res.status(400).send(NO_PARAMS_ERROR)

  const accumail = new Accumail({
    baseUrl: process.env.ACCUMAIL_URL as string,
  })
  try {
    const verifiedAddressResponse = await accumail.getVerifiedAddress(
      req.body as unknown as AddressInput
    )
    res.status(200).json(verifiedAddressResponse)
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined
    const message = isAxiosError(error)
      ? error.response?.data
      : 'Internal Server Error'

    return res.status(status ?? 500).send(message)
  }
}
