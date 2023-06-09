import { AddressInput } from 'types/claimantInput'
import {
  CORRECTED_ADDRESS,
  NO_ADDRESS_MATCH,
  VALID_ADDRESS,
} from 'constants/api/services/verifyAddress'
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
  address?: AddressInput
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
    const accumailResponse = await axios.get<AccumailResponse>(this.baseUrl, {
      headers,
      params: {
        street: query.address,
        street2: query.address2,
        city: query.city,
        state: query.state,
        zip: query.zipcode,
      },
    })
    return this.summarizeValidationAndCreateResponseObject(
      accumailResponse.data
    )
  }
  private summarizeValidationAndCreateResponseObject = (
    response: AccumailResponse
  ): AddressVerificationResponse => {
    if (
      response.resultCount === 1 &&
      '0' === response.result.validationDetails.lookupReturnCode
    ) {
      const destinationAddress = response.result.destinationAddress
      const zipcode = destinationAddress.zipPlusFour
        ? destinationAddress.zip9
        : destinationAddress.zip

      const validationSummary =
        response.result.validationDetails.corrections.length === 0
          ? VALID_ADDRESS // one match that required no corrections found
          : CORRECTED_ADDRESS // single match found after applying corrections
      return {
        address: {
          address: destinationAddress.street,
          address2: destinationAddress.street2,
          city: destinationAddress.city,
          state: destinationAddress.state,
          zipcode,
        },
        validationSummary,
      }
    }
    // No match or multiple matches
    return { validationSummary: NO_ADDRESS_MATCH }
  }
}
