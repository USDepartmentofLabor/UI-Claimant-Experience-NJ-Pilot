/**
 * @jest-environment node
 */
import handler from 'pages/api/services/verify-address'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { AddressInput } from '../../../../types/claimantInput'
import {
  CORRECTED_ADDRESS,
  NO_ADDRESS_MATCH,
} from '../../../../constants/api/services/verifyAddress'
import {
  Accumail,
  AddressVerificationResponse,
} from '../../../../services/Accumail'

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
jest.mock('axios')

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>
function mockLoggedInSession() {
  mockGetServerSession.mockResolvedValueOnce({ accessToken: 'mock' })
}

describe('/api/services/verify-address API Endpoint', () => {
  function mockRequest(input: AddressInput) {
    return {
      query: input,
      setHeader: jest.fn(),
    } as unknown as NextApiRequest
  }

  function mockEmptyRequest() {
    return {
      query: [],
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
    expect(res.status).toHaveBeenCalledWith(400)
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

  it('should error if given request cannot be verified', async () => {
    const req = mockRequest(invalidAddressInput)
    const res = mockResponse()
    mockLoggedInSession()
    jest
      .spyOn(Accumail.prototype, 'getVerifiedAddress')
      .mockResolvedValue(NO_ADDRESS_MATCH)
    await handler(req, res)
    //expect empty address and NO_ADDRESS_MATCH
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
