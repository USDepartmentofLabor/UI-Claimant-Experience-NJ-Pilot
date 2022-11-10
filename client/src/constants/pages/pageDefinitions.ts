import { AnySchema } from 'yup'
import { ClaimantInput } from 'types/claimantInput'
import { PrequalPageDefinition } from 'pages/claim/prequal'
import { PersonalPageDefinition } from 'pages/claim/personal'
import { ContactPageDefinition } from 'pages/claim/contact'
import { DemographicsPageDefinition } from 'pages/claim/demographics'
import { IdentityPageDefinition } from 'pages/claim/identity'
import { UnionPageDefinition } from 'pages/claim/union'
import { DisabilityPageDefinition } from 'pages/claim/disability'
import { PaymentPageDefinition } from 'pages/claim/payment'
import { EducationAndTrainingPageDefinition } from 'pages/claim/education-and-training'
import { ReviewPageDefinition } from 'pages/claim/review'
import { RecentEmployersPageDefinition } from 'pages/claim/recent-employers'

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
