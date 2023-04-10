/* eslint-disable security/detect-non-literal-fs-filename */
import { Occucoder, OccucoderResponse } from './Occucoder'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

function mockOccucoderResponse(items: OccucoderResponse['items'] = []) {
  mockedAxios.post.mockResolvedValueOnce({ data: { items } })
}

describe('Occucoder', () => {
  it('sends job title and description to Occucoder', async () => {
    const occucoder = new Occucoder({
      baseUrl: 'https://mock.example.com/',
    })

    mockOccucoderResponse()

    await occucoder.getOccupationCodes({
      job_title: 'Software Engineer',
      job_description: 'I wrote code',
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://mock.example.com/codes',
      {
        title: 'Software Engineer',
        desc: 'I wrote code',
        lang: '',
        format: 'json',
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
  })

  it('requests Spanish results when locale is es-US', async () => {
    const occucoder = new Occucoder({
      baseUrl: 'https://mock.example.com/',
      locale: 'es-US',
    })

    mockOccucoderResponse()

    await occucoder.getOccupationCodes({
      job_title: 'Software Engineer',
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://mock.example.com/codes',
      {
        title: 'Software Engineer',
        lang: 'sp',
        format: 'json',
      },
      expect.anything()
    )
  })

  it('returns the list of occupations returned by Occucoder, when there are multiple results', async () => {
    const occucoder = new Occucoder({
      baseUrl: 'https://mock.example.com',
    })

    mockOccucoderResponse([
      {
        code: '15-1252.00',
        title: 'Software Developers',
        score: 100,
        desc: 'Analyze user needs and develop software solutions.',
      },
      {
        code: '15-1251.00',
        title: 'Computer Programmer',
        score: 76,
        desc: 'Create, modify, and test the code and scripts that allow computer applications to run.',
      },
    ])

    const occupations = await occucoder.getOccupationCodes({
      job_title: 'Software Engineer',
    })

    expect(occupations).toHaveLength(2)
    expect(occupations[0]).toEqual({
      job_code: '15-1252.00',
      job_description: expect.stringContaining('Analyze user needs'),
      job_title: 'Software Developers',
      score: 100,
    })
  })

  it('returns the list of occupations returned by Occucoder, when there is a single result', async () => {
    const occucoder = new Occucoder({
      baseUrl: 'https://mock.example.com',
    })

    mockOccucoderResponse([
      {
        code: '11-9013.00',
        title: 'Farmers, Ranchers, and Other Agricultural Managers',
        desc: 'Plan, direct, or coordinate the management or operation of farms.',
        score: 100,
      },
    ])

    const occupations = await occucoder.getOccupationCodes({
      job_title: 'Farmer',
    })

    expect(occupations).toHaveLength(1)
  })

  it('returns an empty array when Occucoder returns no results', async () => {
    const occucoder = new Occucoder({
      baseUrl: 'https://mock.example.com',
    })

    mockOccucoderResponse([])

    const occupations = await occucoder.getOccupationCodes({
      job_title: 'GPT Prompt Writer',
    })

    expect(occupations).toHaveLength(0)
  })
})
