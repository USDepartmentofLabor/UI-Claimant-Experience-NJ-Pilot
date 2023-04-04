import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import axios from 'axios'
import { AddressInput } from '../../../types/claimantInput'
import { ADDRESS_SKELETON } from '../../../constants/initialValues'
import {
  CORRECTED_ADDRESS,
  NO_ADDRESS_MATCH,
  NO_PARAMS_ERROR,
  NO_SESSION_ERROR,
  VALID_ADDRESS,
} from '../../../constants/api/services/verifyAddress'
import {
  Accumail,
  AccumailResponse,
  AddressVerificationResponse,
} from '../../../services/Accumail'

/**
 * Check the user-entered address and use service to check if USPS provides potential corrections or a match
 * Method: GET
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
  if (!Object.keys(req.query).length)
    return res.status(400).send(NO_PARAMS_ERROR)

  const accumail = new Accumail({
    baseUrl: process.env.ACCUMAIL_URL as string,
  })

  try {
    const verifiedAddressResponse = await accumail.getVerifiedAddress(
      req.query as unknown as AddressInput
    )
    res.status(200).json(verifiedAddressResponse)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res
        .status(error.response?.status || 500)
        .send(error.response?.data || error.message)
    }
    return res.status(400)
  }
}
