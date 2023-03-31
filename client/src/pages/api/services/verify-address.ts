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

export type AccumailResponse = {
  success: boolean
  message: string
  errorCount: number
  errors: string
  failCount: number
  resultCount: number
  result: {
    destinationAddress: {
      company: string
      street: string
      street2: string
      street3: string
      suite: string
      urbanization: string
      city: string
      state: string
      zip: string
      zipPlusFour: string
      zip9: string
    }
    validationDetails: {
      lookupReturnCode: string
      lookupReturnDescription: string
      dpv: string
      dpvDescription: string
      dpvFootNotes: string
      lacs: string
      corrections: string
      correctionsText: string
      leftOvers: string
      recordType: string
      isRuralRouteDefault: string
      isHighriseDefault: string
    }
  }
}

export type AddressVerificationResponse = {
  address: AddressInput
  validationSummary: string
}

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

  const accumailBaseURL = process.env.ACCUMAIL_URL || ''

  try {
    const accumailResponse = await axios.get<AccumailResponse>(
      accumailBaseURL +
        '?' +
        convertJSONAddressToURLParams(req.query as unknown as AddressInput)
    )
    return res
      .status(200)
      .send(summarizeValidationAndCreateResponseObject(accumailResponse.data))
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res
        .status(error.response?.status || 500)
        .send(error.response?.data || error.message)
    }
    return res.status(400)
  }
}

const summarizeValidationAndCreateResponseObject = (
  response: AccumailResponse
): AddressVerificationResponse | string => {
  if (
    response.resultCount === 1 &&
    '0' === response.result.validationDetails.lookupReturnCode
  ) {
    if (response.result.validationDetails.corrections.length === 0) {
      // one match that required no corrections found
      return {
        address: parseResponseAddress(response),
        validationSummary: VALID_ADDRESS,
      }
    }
    // single match found after applying corrections
    return {
      address: parseResponseAddress(response),
      validationSummary: CORRECTED_ADDRESS,
    }
  }
  // No match or multiple matches
  return NO_ADDRESS_MATCH
}

const convertJSONAddressToURLParams = (
  params: AddressInput | undefined
): string => {
  let urlParams = new URLSearchParams(params).toString()
  urlParams = urlParams.replace('address', 'street')
  urlParams = urlParams.replace('address2', 'street2')
  urlParams = urlParams.replace('zipcode', 'zip')
  return urlParams
}
const parseResponseAddress = (response: AccumailResponse): AddressInput => {
  const convertedAddress = ADDRESS_SKELETON
  convertedAddress.address = response.result.destinationAddress.street
  convertedAddress.address2 = response.result.destinationAddress.street2
  convertedAddress.city = response.result.destinationAddress.city
  convertedAddress.state = response.result.destinationAddress.state
  if (response.result.destinationAddress.zipPlusFour) {
    convertedAddress.zipcode = response.result.destinationAddress.zip9
  } else {
    convertedAddress.zipcode = response.result.destinationAddress.zip
  }
  return convertedAddress
}
