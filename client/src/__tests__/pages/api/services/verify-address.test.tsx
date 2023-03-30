/**
 * @jest-environment node
 */
import handler, { AccumailResponse } from 'pages/api/services/verify-address'
import type { NextApiRequest, NextApiResponse } from 'next'
jest.mock('next-auth/next')
import { getServerSession } from 'next-auth/next'
import { AddressInput } from '../../../../types/claimantInput'
import { ADDRESS_SKELETON } from '../../../../constants/initialValues'
import {
  NO_ACCUMAIL_RESPONSE,
  NO_ADDRESS_MATCH,
} from '../../../../constants/api/services/verifyAddress'

const addressInput: AddressInput = {
  address: '1445 New York Ave',
  address2: '',
  city: 'Washington',
  state: 'DC',
  zipcode: '20500',
}
const invalidAddressInput: AddressInput = {
  address: 'nowhere',
  address2: '',
  city: 'Washington',
  state: 'DC',
  zipcode: '20500',
}
const verifiedAddress = {
  address: addressInput,
  validationSummary: '',
}

const accumailResponse = {
  success: true,
  message: 'Succeeded',
  errorCount: 0,
  errors: null,
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
      corrections: 'AJORT',
      correctionsText:
        'Normal street match,Highrise default match,Postdirectional corrected,ZIP corrected,ZIP+4 corrected',
      leftOvers: '',
      recordType: 'H',
      isRuralRouteDefault: 'N',
      isHighriseDefault: 'Y',
    },
  },
}

const noMatchAccumailReponse = {
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
}

const mockGetVerifiedAddress = jest.fn().mockImplementation(() => ({
  status: 200,
  data: accumailResponse,
}))

const mockGetNoAddressMatch = jest.fn().mockImplementation(() => ({
  status: 200,
  data: noMatchAccumailReponse,
}))

const mockGetServerSession = getServerSession as jest.Mock

const tokenValue = 'fakeToken'

describe('/api/services/verify-address API Endpoint', () => {
  function mockRequestResponse() {
    const req = {
      query: addressInput,
      setHeader: jest.fn(),
    } as unknown as NextApiRequest
    const res = {
      json: verifiedAddress,
      status: (status: number) => ({
        send: (response: AccumailResponse) => ({ status, response }),
      }),
      setHeader: jest.fn(),
    } as unknown as NextApiResponse
    return { req, res }
  }
  function mockUnverifiableRequestResponse() {
    const req = {
      query: invalidAddressInput,
      setHeader: jest.fn(),
    } as unknown as NextApiRequest
    const res = {
      status: (status: number) => ({
        send: (response: AccumailResponse) => ({ status, response }),
      }),
      setHeader: jest.fn(),
    } as unknown as NextApiResponse
    return { req, res }
  }

  function mockFailRequestResponse() {
    const req = {
      query: invalidAddressInput,
      setHeader: jest.fn(),
    } as unknown as NextApiRequest
    const res = {
      data: {
        address: ADDRESS_SKELETON,
        verificationSummary: NO_ACCUMAIL_RESPONSE,
      },
      status: () => ({
        send: () => 500,
      }),
      setHeader: jest.fn(),
    } as unknown as NextApiResponse
    return { req, res }
  }

  function mockEmptyParamsRequestResponse() {
    const req = {
      query: [],
      setHeader: jest.fn(),
    } as unknown as NextApiRequest
    const res = {
      status: () => ({
        send: () => 400,
      }),
      setHeader: jest.fn(),
    } as unknown as NextApiResponse
    return { req, res }
  }

  it('should return a successful response', async () => {
    const { req, res } = mockRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))
    jest.mock('axios', () => ({
      ...jest.requireActual('axios'),
      get: (url: string) => mockGetVerifiedAddress(url),
      isAxiosError: () => {
        return {
          error: {
            message: 'Error',
          },
        }
      },
    }))
    const response = await handler(req, res)
    expect(response?.status).toBe(200)
  })

  it('should error out without a user session', async () => {
    const { req, res } = mockRequestResponse()
    mockGetServerSession.mockImplementation(() => null)
    const response = await handler(req, res)
    expect(response?.status).toBe(401)
  })

  it('should error out if no response from server', async () => {
    const { req, res } = mockFailRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))
    // intentionally skipping axios response mock to simulate no response from service
    const response = await handler(req, res)
    expect(response).toBe(500)
  })

  it('should error if no params', async () => {
    const { req, res } = mockEmptyParamsRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))
    const response = await handler(req, res)
    expect(response).toBe(400)
  })

  it('should error if given request cannot be verified', async () => {
    jest.unmock('axios')
    const { req, res } = mockUnverifiableRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))
    jest.mock('axios', () => ({
      ...jest.requireActual('axios'),
      get: (url: string) => mockGetNoAddressMatch(url),
      isAxiosError: () => {
        return {
          error: {
            message: 'Error',
          },
        }
      },
    }))
    const response = await handler(req, res)
    //expect empty address and NO_ADDRESS_MATCH
    expect(response).toStrictEqual({
      response: {
        address: {
          address: '',
          address2: '',
          city: '',
          state: '',
          zipcode: '',
        },
        validationSummary: 'Could not match address',
      },
      status: 200,
    })
  })
})
