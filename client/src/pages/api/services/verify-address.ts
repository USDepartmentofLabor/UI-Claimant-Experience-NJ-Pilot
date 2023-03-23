import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { AddressInput } from '../../../types/claimantInput'
import { ADDRESS_SKELETON } from '../../../constants/initialValues'
import address from '../../../components/form/Address/Address'

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
  errorSummary: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JSON>
): Promise<any> {
  try {
    const params = req.url && req.url.slice(req.url.indexOf('?'))
    const accumailResponse = await axios.get(
      'http://la-clmusps-ha-s.njdol.ad.dol/AccumailRest/api/Address' + params
    )
    if (accumailResponse.data && accumailResponse.data.success) {
      const responseData: AddressVerificationResponse = createResponse(
        accumailResponse.data
      )
      return res.status(200).send(<JSON>(<unknown>responseData)) //TODO MRH is there a better way?
    } else {
      return res
        .status(500)
        .send(<JSON>(<unknown>{ error: 'No Response from AccuMail' }))
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

const createResponse = (
  response: AccumailResponse
): AddressVerificationResponse => {
  //mrh: Check for errors
  //mrh: currently returns garbage if given garbage
  return { address: parseResponseAddress(response), errorSummary: '' }
}
const parseResponseAddress = (response: AccumailResponse): AddressInput => {
  let convertedAddress = ADDRESS_SKELETON
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

//TODO: create a function to handle error codes
