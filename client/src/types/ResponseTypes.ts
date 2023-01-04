import { Claim } from './Claim'
import { Employer } from './claimantInput'

export type APIResponseType = {
  status: string
  error: string
}

export type PartialClaimResponseType = Partial<Claim>

export type RecentEmployersResponseType = Partial<Employer>[]
