import { AddressInput } from '../types/claimantInput'
import {
  CORRECTED_ADDRESS,
  NO_ADDRESS_MATCH,
  VALID_ADDRESS,
} from '../constants/api/services/verifyAddress'
import { ADDRESS_SKELETON } from '../constants/initialValues'
import axios from 'axios'

export interface AccumailResponse {
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

export interface AddressVerificationResponse {
  address: AddressInput
  validationSummary: string
}

export class Accumail {
  /* URL of the Accumail service */
  private baseUrl: string
  constructor(config: { baseUrl: string }) {
    this.baseUrl = config.baseUrl
  }

  async getVerifiedAddress(query: AddressInput) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    let accumailResponse = await axios.get<AccumailResponse>(
      this.baseUrl +
        '?' +
        this.convertJSONAddressToURLParams(query as unknown as AddressInput),
      { headers }
    )
    return this.summarizeValidationAndCreateResponseObject(
      accumailResponse.data
    )
  }
  private summarizeValidationAndCreateResponseObject = (
    response: AccumailResponse
  ): AddressVerificationResponse | string => {
    if (
      response.resultCount === 1 &&
      '0' === response.result.validationDetails.lookupReturnCode
    ) {
      if (response.result.validationDetails.corrections.length === 0) {
        // one match that required no corrections found
        return {
          address: this.parseResponseAddress(response),
          validationSummary: VALID_ADDRESS,
        }
      }
      // single match found after applying corrections
      return {
        address: this.parseResponseAddress(response),
        validationSummary: CORRECTED_ADDRESS,
      }
    }
    // No match or multiple matches
    return NO_ADDRESS_MATCH
  }

  private convertJSONAddressToURLParams = (
    params: AddressInput | undefined
  ): string => {
    let urlParams = new URLSearchParams(params).toString()
    urlParams = urlParams.replace('address', 'street')
    urlParams = urlParams.replace('address2', 'street2')
    urlParams = urlParams.replace('zipcode', 'zip')
    return urlParams
  }
  private parseResponseAddress = (response: AccumailResponse): AddressInput => {
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
}
