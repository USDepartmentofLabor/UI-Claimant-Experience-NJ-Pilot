/**
 * @jest-environment node
 */
import handler from 'pages/api/services/verify-address'
import type { NextApiRequest, NextApiResponse } from 'next'
jest.mock('next-auth')
import { getServerSession } from 'next-auth'
import { AddressInput } from '../../../../types/claimantInput'

const addressInput: AddressInput = {
  address: '1234 Broken Dreams Boulevard',
  address2: 'Unit G',
  city: 'New York',
  state: 'NY',
  zipcode: '12345',
}
const verifiedAddress = {
  address: {
    address: '1234 Broken Dreams Boulevard',
    address2: 'Unit G',
    city: 'New York',
    state: 'NY',
    zipcode: '12345',
  },
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
    const req = {} as NextApiRequest
    const res = {
      error: {
        message: 'An error occurred',
      },
      status: () => ({
        send: () => 500,
      }),
      setHeader: jest.fn(),
    } as unknown as NextApiResponse
    return { req, res }
  }

  function mockEndpointErrorRequestResponse() {}

  function mockEmptyParamsRequestResponse() {}

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

  /*it('should error out if no response from server', async () => {
    const { req, res } = mockFailRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))

    const response = await handler(req, res)
    expect(response).toBe(500)
  })*/

  it('should error if no params', async () => {})

  it('should error if given request cannot be verified', async () => {})
})
