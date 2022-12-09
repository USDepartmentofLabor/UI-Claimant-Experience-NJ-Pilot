import { AnySchema } from 'yup'
import { ClaimantInput } from 'types/claimantInput'

import { PrequalPageDefinition } from 'constants/pages/definitions/prequalPageDefinition'
import { PersonalPageDefinition } from 'constants/pages/definitions/personalPageDefinition'
import { ContactPageDefinition } from 'constants/pages/definitions/contactPageDefinition'
import { DemographicsPageDefinition } from 'constants/pages/definitions/demographicsPageDefinition'
import { IdentityPageDefinition } from 'constants/pages/definitions/identityPageDefinition'
import { EducationAndTrainingPageDefinition } from 'constants/pages/definitions/educationAndTrainingPageDefinition'
import { RecentEmployersPageDefinition } from 'constants/pages/definitions/recentEmployersPageDefinition'
import { UnionPageDefinition } from 'constants/pages/definitions/unionPageDefinition'
import { DisabilityPageDefinition } from 'constants/pages/definitions/disabilityPageDefinition'
import { PaymentPageDefinition } from 'constants/pages/definitions/paymentPageDefinition'
import { ReviewPageDefinition } from 'constants/pages/definitions/reviewPageDefinition'

export type PageDefinition = {
  heading: string
  path: string
  initialValues: ClaimantInput
  validationSchema: AnySchema
  previousPage?: (values: ClaimantInput) => string
  nextPage?: (values: ClaimantInput) => string
}

export const pageDefinitions: PageDefinition[] = [
  PrequalPageDefinition,
  PersonalPageDefinition,
  ContactPageDefinition,
  DemographicsPageDefinition,
  RecentEmployersPageDefinition,
  IdentityPageDefinition,
  // EmployerPageDefinition,
  // EmployerReviewPageDefinition,
  // SelfEmploymentPageDefinition,
  // OtherPayPageDefinition,
  // OccupationPageDefinition,
  EducationAndTrainingPageDefinition,
  UnionPageDefinition,
  DisabilityPageDefinition,
  PaymentPageDefinition,
  ReviewPageDefinition,
]

export const getNextPage = (current: PageDefinition) => {
  const currentPageIndex = pageDefinitions.indexOf(current)

  if (currentPageIndex >= pageDefinitions.length - 1) {
    throw new Error(`${current.path} has no next page`)
  }

  return pageDefinitions.at(currentPageIndex + 1) as PageDefinition
}

export const getPreviousPage = (current: PageDefinition) => {
  const currentPageIndex = pageDefinitions.indexOf(current)
  if (currentPageIndex <= 0) {
    throw new Error(`${current.path} has no previous page`)
  }
  return pageDefinitions.at(currentPageIndex - 1) as PageDefinition
}
