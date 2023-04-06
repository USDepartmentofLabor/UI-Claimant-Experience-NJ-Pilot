import { Accumail } from './Accumail'
import axios from 'axios'
import { AddressInput } from 'types/claimantInput'
import {
  CORRECTED_ADDRESS,
  NO_ADDRESS_MATCH,
  VALID_ADDRESS,
} from 'constants/api/services/verifyAddress'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const correctableAddressInput: AddressInput = {
  address: '1445 New York Ave',
  address2: '',
  city: 'Washington',
  state: 'DC',
  zipcode: '20005',
}
const validAddressInput: AddressInput = {
  address: '1445 NEW YORK AVE NW',
  address2: '',
  city: 'WASHINGTON',
  state: 'DC',
  zipcode: '20005-2134',
}
const validFiveDigitZipAddressInput: AddressInput = {
  address: '123 SESAME ST W',
  address2: '',
  city: 'NEW YORK',
  state: 'NY',
  zipcode: '12345',
}
const unmatchableAddress: AddressInput = {
  address: 'nowhere',
  address2: '',
  city: 'Washington',
  state: 'DC',
  zipcode: '20500',
}
const validAddressAccumailResponse = {
  data: {
    success: true,
    message: 'Succeeded',
    errorCount: 0,
    errors: '',
    failCount: 0,
    resultCount: 1,
    result: {
      destinationAddress: {
        company: '',
        street: '1445 NEW YORK AVE NW',
        street2: '',
        street3: '',
        suite: '',
        urbanization: '',
        city: 'WASHINGTON',
        state: 'DC',
        zip: '20005',
        zipPlusFour: '2134',
        zip9: '20005-2134',
      },
      validationDetails: {
        lookupReturnCode: '0',
        lookupReturnDescription: 'The address has been successfully coded.',
        dpv: '',
        dpvDescription: '',
        dpvFootNotes: '',
        lacs: '',
        corrections: '',
        correctionsText: '',
        leftOvers: '',
        recordType: 'H',
        isRuralRouteDefault: 'N',
        isHighriseDefault: 'Y',
      },
    },
  },
}
const correctedAddressAccumailResponse = {
  data: {
    success: true,
    message: 'Succeeded',
    errorCount: 0,
    errors: '',
    failCount: 0,
    resultCount: 1,
    result: {
      destinationAddress: {
        company: '',
        street: '1445 NEW YORK AVE NW',
        street2: '',
        street3: '',
        suite: '',
        urbanization: '',
        city: 'WASHINGTON',
        state: 'DC',
        zip: '20005',
        zipPlusFour: '2134',
        zip9: '20005-2134',
      },
      validationDetails: {
        lookupReturnCode: '0',
        lookupReturnDescription: 'The address has been successfully coded.',
        dpv: 'DN NNN',
        dpvDescription:
          'Input address matched to the ZIP+4 product. Input address primary number matched to DPV but address missing secondary number.',
        dpvFootNotes: 'AAN1',
        lacs: '',
        corrections: 'AJOT',
        correctionsText:
          'Normal street match,Highrise default match,Postdirectional corrected,ZIP+4 corrected',
        leftOvers: '',
        recordType: 'H',
        isRuralRouteDefault: 'N',
        isHighriseDefault: 'Y',
      },
    },
  },
}
const unmatchableAddressAccumailResponse = {
  data: {
    success: true,
    message: 'Succeeded',
    errorCount: 0,
    errors: null,
    failCount: 0,
    resultCount: 1,
    result: {
      destinationAddress: {
        company: '',
        street: 'NOWHERE',
        street2: '',
        street3: '',
        suite: '',
        urbanization: '',
        city: 'WASHINGTON',
        state: 'DC',
        zip: '20500',
        zipPlusFour: '',
        zip9: '20500-',
      },
      validationDetails: {
        lookupReturnCode: '7',
        lookupReturnDescription:
          'There are no street name matches in the given ZIP code or in any geographically-related ZIP code.',
        dpv: '',
        dpvDescription:
          'Input address not matched to the ZIP+4 product. Input address primary number missing.',
        dpvFootNotes: 'A1M1',
        lacs: '',
        corrections: '',
        correctionsText: '',
        leftOvers: '',
        recordType: ' ',
        isRuralRouteDefault: 'N',
        isHighriseDefault: 'N',
      },
    },
  },
}
const validFiveDigitZipAddressAccumailResponse = {
  data: {
    success: true,
    message: 'Succeeded',
    errorCount: 0,
    errors: '',
    failCount: 0,
    resultCount: 1,
    result: {
      destinationAddress: {
        company: '',
        street: '123 SESAME ST W',
        street2: '',
        street3: '',
        suite: '',
        urbanization: '',
        city: 'NEW YORK',
        state: 'NY',
        zip: '12345',
        zipPlusFour: '',
        zip9: '',
      },
      validationDetails: {
        lookupReturnCode: '0',
        lookupReturnDescription: 'The address has been successfully coded.',
        dpv: '',
        dpvDescription: '',
        dpvFootNotes: '',
        lacs: '',
        corrections: '',
        correctionsText: '',
        leftOvers: '',
        recordType: 'H',
        isRuralRouteDefault: 'N',
        isHighriseDefault: 'Y',
      },
    },
  },
}
describe('Accumail', () => {
  it('receives a valid address response from Accumail', async () => {
    const accumail = new Accumail({
      baseUrl: 'https://mock.example.com/',
    })

    mockedAxios.get.mockResolvedValueOnce(validAddressAccumailResponse)

    const responseFromAccumail = await accumail.getVerifiedAddress(
      validAddressInput
    )
    expect(responseFromAccumail).toEqual({
      address: validAddressInput,
      validationSummary: VALID_ADDRESS,
    })
  })

  it('receives a corrected address response from Accumail', async () => {
    const accumail = new Accumail({
      baseUrl: 'https://mock.example.com/',
    })

    mockedAxios.get.mockResolvedValueOnce(correctedAddressAccumailResponse)

    const responseFromAccumail = await accumail.getVerifiedAddress(
      correctableAddressInput
    )
    expect(responseFromAccumail).toEqual({
      address: validAddressInput,
      validationSummary: CORRECTED_ADDRESS,
    })
  })

  it('receives a no match response from Accumail', async () => {
    const accumail = new Accumail({
      baseUrl: 'https://mock.example.com/',
    })

    mockedAxios.get.mockResolvedValueOnce(unmatchableAddressAccumailResponse)

    const responseFromAccumail = await accumail.getVerifiedAddress(
      unmatchableAddress
    )

    expect(responseFromAccumail).toEqual({
      validationSummary: NO_ADDRESS_MATCH,
    })
  })

  it('a valid address with a zip code with containing only five digits is parsed correctly', async () => {
    const accumail = new Accumail({
      baseUrl: 'https://mock.example.com/',
    })

    mockedAxios.get.mockResolvedValueOnce(
      validFiveDigitZipAddressAccumailResponse
    )

    const responseFromAccumail = await accumail.getVerifiedAddress(
      validFiveDigitZipAddressInput
    )
    expect(responseFromAccumail).toEqual({
      address: validFiveDigitZipAddressInput,
      validationSummary: VALID_ADDRESS,
    })
  })
})
