/**
 * @jest-environment node
 */
import handler from 'pages/api/services/verify-address'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { AddressInput } from 'types/claimantInput'
import {
  CORRECTED_ADDRESS,
  NO_ADDRESS_MATCH,
} from 'constants/api/services/verifyAddress'
import { Accumail, AddressVerificationResponse } from 'services/Accumail'
import { AxiosError, AxiosResponse } from 'axios'

const addressInput: AddressInput = {
  address: '1445 New York Ave',
  address2: '',
  city: 'Washington',
  state: 'DC',
  zipcode: '20005',
}
const invalidAddressInput: AddressInput = {
  address: 'nowhere',
  address2: '',
  city: 'Washington',
  state: 'DC',
  zipcode: '20500',
}
const verifiedResponse: AddressVerificationResponse = {
  address: addressInput,
  validationSummary: CORRECTED_ADDRESS,
}

jest.mock('next-auth/next')
jest.mock('services/Accumail')

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>
function mockLoggedInSession() {
  mockGetServerSession.mockResolvedValueOnce({ accessToken: 'mock' })
}

describe('/api/services/verify-address API Endpoint', () => {
  function mockRequest(input: AddressInput) {
    return {
      body: input,
      setHeader: jest.fn(),
    } as unknown as NextApiRequest
  }

  function mockEmptyRequest() {
    return {
      body: [],
      setHeader: jest.fn(),
    } as unknown as NextApiRequest
  }
  function mockResponse() {
    return {
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as NextApiResponse
  }

  it('should return a successful response', async () => {
    const req = mockRequest(addressInput)
    const res = mockResponse()
    mockLoggedInSession()
    jest
      .spyOn(Accumail.prototype, 'getVerifiedAddress')
      .mockResolvedValue(verifiedResponse)
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(verifiedResponse)
  })

  it('should error out without a user session', async () => {
    const req = mockRequest(addressInput)
    const res = mockResponse()
    mockGetServerSession.mockResolvedValueOnce(null)

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('should error out if Accumail response is error', async () => {
    const req = mockRequest(addressInput)
    const res = mockResponse()
    mockLoggedInSession()
    jest
      .spyOn(Accumail.prototype, 'getVerifiedAddress')
      .mockRejectedValue(new Error('error'))
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('responds with the Accumail error response status and message', async () => {
    const req = mockRequest(addressInput)
    const res = mockResponse()

    mockLoggedInSession()

    jest.spyOn(Accumail.prototype, 'getVerifiedAddress').mockRejectedValue(
      new AxiosError('Mocked error', '400', undefined, undefined, {
        status: 400,
        data: 'Mocked error response body',
      } as AxiosResponse)
    )

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith('Mocked error response body')
  })

  it('should error if no params', async () => {
    const req = mockEmptyRequest()
    const res = mockResponse()
    mockLoggedInSession()
    jest
      .spyOn(Accumail.prototype, 'getVerifiedAddress')
      .mockResolvedValue(verifiedResponse)
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should return NO_ADDRESS_MATCH if given request cannot be verified', async () => {
    const req = mockRequest(invalidAddressInput)
    const res = mockResponse()
    mockLoggedInSession()
    jest.spyOn(Accumail.prototype, 'getVerifiedAddress').mockResolvedValue({
      validationSummary: NO_ADDRESS_MATCH,
    })
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      validationSummary: NO_ADDRESS_MATCH,
    })
  })
})
