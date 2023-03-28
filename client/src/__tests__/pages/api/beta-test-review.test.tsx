/**
 * @jest-environment node
 */
import handler from 'pages/api/beta-test-review'
import type { NextApiRequest, NextApiResponse } from 'next'
jest.mock('next-auth')
import { getServerSession } from 'next-auth'

const mockBetaTestGet = jest.fn().mockImplementation(() => ({
  status: 200,
  data: { claimFormValues: 'test' },
}))
const mockAxiosPost = jest.fn().mockImplementation(() => ({
  status: 200,
  statusText: 'OK',
  send: jest.fn(),
}))
jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  create: () => ({
    get: (url: string) => mockBetaTestGet(url),
    post: (url: string, html: string) => mockAxiosPost(url, html),
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

describe('/api/beta-test-review API Endpoint', () => {
  function mockRequestResponse() {
    const req = {} as NextApiRequest
    const res = {
      json: jest.fn(),
      status: (status: number) => ({
        send: (statusText: string) => ({ status, statusText }),
      }),
      setHeader: jest.fn(),
      send: jest.fn(),
    } as unknown as NextApiResponse
    return { req, res }
  }
  function mockFailRequestResponse() {
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

  it('should return a successful response', async () => {
    const { req, res } = mockRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))
    const response = await handler(req, res)
    expect(response.statusText).toBe('OK')
    expect(response.status).toBe(200)
  })

  it('should error out without a user session', async () => {
    const { req, res } = mockRequestResponse()
    mockGetServerSession.mockImplementation(() => null)
    const response = await handler(req, res)
    expect(response.statusText).not.toBe('OK')
    expect(response.status).toBe(400)
  })

  it('should error out no complete claim', async () => {
    const { req, res } = mockRequestResponse()
    jest.mock('axios', () => ({
      get: () => null,
    }))
    const response = await handler(req, res)
    expect(response.statusText).not.toBe('OK')
    expect(response.status).toBe(400)
  })
  it('should error out if no response from server', async () => {
    const { req, res } = mockFailRequestResponse()
    mockGetServerSession.mockImplementation(() => ({
      accessToken: tokenValue,
    }))

    const response = await handler(req, res)
    expect(response).toBe(500)
  })
})
