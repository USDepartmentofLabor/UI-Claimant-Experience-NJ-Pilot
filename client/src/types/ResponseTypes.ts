import { Claim } from './Claim'

export type APIResponseType = {
  status: string
  error: string
}

export type PartialClaimResponseType = Partial<Claim>
