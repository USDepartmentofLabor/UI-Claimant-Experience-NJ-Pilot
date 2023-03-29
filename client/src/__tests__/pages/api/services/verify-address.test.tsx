/**
 * @jest-environment node
 */
import handler from 'pages/api/services/verify-address'
import type { NextApiRequest, NextApiResponse } from 'next'
jest.mock('next-auth')
import { getServerSession } from 'next-auth'
import { AddressInput } from '../../../../types/claimantInput'
import { ADDRESS_SKELETON } from '../../../../constants/initialValues'
import {
  NO_ACCUMAIL_RESPONSE,
  NO_ADDRESS_MATCH,
} from '../../../../constants/api/services/verifyAddress'

const addressInput: AddressInput = {
  address: '1234 Broken Dreams Boulevard',
  address2: 'Unit G',
  city: 'New York',
  state: 'NY',
  zipcode: '12345',
}
const invalidAddressInput: AddressInput = {
  address: 'not a real place',
  address2: '',
  city: 'Trenton',
  state: 'NJ',
  zipcode: '12345',
}
const verifiedAddress = {
  address: addressInput,
  validationSummary: '',
}

const mockGetVerifiedAddress = jest.fn().mockImplementation(() => ({
  status: 200,
  data: verifiedAddress,
}))

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  create: () => ({
    get: (url: string) => mockGetVerifiedAddress(url),
  }),
  isAxiosError: () => {
    return {
      error: {
        message: 'Error',
      },
    }
  },
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
      data: verifiedAddress,
      status: () => ({
        send: () => 200,
      }),
    } as unknown as NextApiResponse
    return { req, res }
  }
  function mockUnverifiableRequestResponse() {
    const req = {
      query: invalidAddressInput,
      setHeader: jest.fn(),
    } as unknown as NextApiRequest
    const res = {
      data: {
        address: ADDRESS_SKELETON,
        verificationSummary: NO_ADDRESS_MATCH,
      },
      status: () => ({
        send: () => 200,
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
    const response = await handler(req, res)
    expect(response?.status).toBe(200)
  })

  it('should error out without a user session', async () => {
    const { req, res } = mockRequestResponse()
    mockGetServerSession.mockImplementation(() => null)
    const response = await handler(req, res)
    expect(response?.status).toBe(400)
  })

  it('should error out if no response from server', async () => {
    const { req, res } = mockFailRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))
    const response = await handler(req, res)
    expect(response).toBe(500)
  })

  it('should error if no params', async () => {
    const { req, res } = mockEmptyParamsRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))

    const response = await handler(req, res)
    expect(response).toBe(500)
  })

  it('should error if given request cannot be verified', async () => {
    const { req, res } = mockUnverifiableRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))
    const response = await handler(req, res)
    //expect empty address and NO_ADDRESS_MATCH
    expect(response).toBe(200)
  })
})
