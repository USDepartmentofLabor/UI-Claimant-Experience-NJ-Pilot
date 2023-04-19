/**
 * @file Occucoder is an occupation lookup service self-hosted by NJ.
 * Gets O*Net-SOC Occupation Codes (https://www.bls.gov/soc) that match a given query.
 * @see docs/integrations/ for Occucoder usage guide.
 */
import axios from 'axios'

/**
 * @see https://www.bls.gov/soc
 */
export interface SOCOccupation {
  job_title: string
  job_description: string
  job_code: string
  score: number
}

export interface OccucoderResponse {
  items?: Array<{
    code: string
    title: string
    score: number
    desc: string
  }>
}

export class Occucoder {
  /* URL of the Occucoder service */
  private baseUrl: string
  /* The language which Occupation details should be returned in */
  private locale: string

  constructor(config: { baseUrl: string; locale?: string }) {
    this.locale = config.locale ?? 'en-US'
    this.baseUrl = config.baseUrl.trim().replace(/\/$/, '') // trim trailing slash
  }

  async getOccupationCodes(query: {
    job_title: string
    job_description?: string
  }) {
    const url = `${this.baseUrl}/codes`
    const body = {
      title: query.job_title,
      desc: query.job_description,
      lang: this.locale.includes('es') ? 'sp' : '',
      format: 'json',
    }
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    const response = await axios.post(url, body, { headers })

    return this.parseResponseIntoOccupations(response.data)
  }

  /**
   * Convert Occucoder's response into a cleaner JSON, and grab
   * the list of occupations.
   */
  private parseResponseIntoOccupations(
    response: OccucoderResponse
  ): SOCOccupation[] {
    // No results
    if (!response.items) return []

    const occupations = response.items
      .map((entry) => {
        return {
          job_title: entry.title,
          job_description: entry.desc,
          job_code: entry.code,
          score: entry.score,
        }
      })
      .sort((a, b) => b.score - a.score) // descending (100-0)

    return occupations
  }
}
