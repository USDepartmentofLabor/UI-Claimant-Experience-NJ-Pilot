import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { AddressInput } from '../../../types/claimantInput'
import { ADDRESS_SKELETON } from '../../../constants/initialValues'

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddressVerificationResponse>
): Promise<any> {
  try {
    const params = req.url && req.url.slice(req.url.indexOf('?'))
    const accumailResponse = await axios.get(
      'http://la-clmusps-ha-s.njdol.ad.dol/AccumailRest/api/Address' + params
    )
    if (accumailResponse.data && accumailResponse.data.success) {
      return res
        .status(200)
        .send(summarizeValidationAndCreateResponseObject(accumailResponse.data))
    } else {
      return res.status(500).send({
        address: ADDRESS_SKELETON,
        validationSummary: 'No Response from AccuMail',
      })
    }
  } catch (error) {
    res.setHeader('Content-Type', 'text/plain')
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
): AddressVerificationResponse => {
  if (
    response.resultCount === 1 &&
    '0' === response.result.validationDetails.lookupReturnCode
  ) {
    if (response.result.validationDetails.corrections.length === 0) {
      // one match that required no corrections found
      return {
        address: parseResponseAddress(response),
        validationSummary: 'Valid address',
      }
    }
    // single match found after applying corrections
    return {
      address: parseResponseAddress(response),
      validationSummary: 'Corrections applied',
    }
  }
  // No match or multiple matches
  return {
    address: ADDRESS_SKELETON,
    validationSummary: 'Could not match address',
  }
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
