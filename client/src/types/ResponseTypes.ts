import { Claim } from './Claim'
import { WgpmEmployer } from 'utils/employer/employerUtils'

export type APIResponseType = {
  status: string
  error: string
}

export type PartialClaimResponseType = Partial<Claim>

export type RecentEmployersResponseType = WgpmEmployer[]
