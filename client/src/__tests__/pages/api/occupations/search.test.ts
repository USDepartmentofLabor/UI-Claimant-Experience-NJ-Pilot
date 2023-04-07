/**
 * @jest-environment node
 */
import { Occucoder } from 'services/Occucoder'
import { getServerSession } from 'next-auth/next'
import handler from 'pages/api/occupations/search'
import { NextApiRequest, NextApiResponse } from 'next'
import { AxiosError, AxiosResponse } from 'axios'

jest.mock('next-auth/next')
jest.mock('services/Occucoder')

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>

function getMockRequest(body = { job_title: 'Software Engineer' }) {
  return {
    body,
  } as NextApiRequest
}

function getMockResponse() {
  return {
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  } as unknown as NextApiResponse
}

function mockLoggedInSession() {
  mockGetServerSession.mockResolvedValueOnce({ accessToken: 'mock' })
}

describe('POST /api/occupations/search', () => {
  it('responds with occupation results', async () => {
    const req = getMockRequest()
    const res = getMockResponse()

    const mockOccupations = [
      {
        job_title: 'Software Engineer',
        job_description: 'Software Engineer',
        job_code: '15-1132',
        score: 100,
      },
    ]

    mockLoggedInSession()
    jest
      .spyOn(Occucoder.prototype, 'getOccupationCodes')
      .mockResolvedValue(mockOccupations)

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ occupations: mockOccupations })
  })

  it('responds with 401 when not authenticated', async () => {
    const req = getMockRequest()
    const res = getMockResponse()

    mockGetServerSession.mockResolvedValueOnce(null)

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('responds with 400 when job title is blank space', async () => {
    const req = getMockRequest({ job_title: ' ' })
    const res = getMockResponse()

    mockLoggedInSession()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('responds with 500 when Occucoder service throw a generic error', async () => {
    const req = getMockRequest()
    const res = getMockResponse()

    mockLoggedInSession()
    jest
      .spyOn(Occucoder.prototype, 'getOccupationCodes')
      .mockRejectedValue(new Error('mock'))
    // Error is intentionally logged for this scenario
    jest.spyOn(console, 'error').mockImplementation()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })

  it('responds with the Occucoder error response status and message', async () => {
    const req = getMockRequest()
    const res = getMockResponse()

    mockLoggedInSession()

    jest.spyOn(Occucoder.prototype, 'getOccupationCodes').mockRejectedValue(
      new AxiosError('Mocked error', '400', undefined, undefined, {
        status: 400,
        data: 'Mocked error response body',
      } as AxiosResponse)
    )

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      error: 'Mocked error response body',
    })
  })
})
