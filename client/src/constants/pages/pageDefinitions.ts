import { AnySchema } from 'yup'
import { ClaimantInput } from 'types/claimantInput'
import { PersonalPageDefinition } from 'pages/claim/personal'
import { ContactPageDefinition } from 'pages/claim/contact'
import { DemographicsPageDefinition } from 'pages/claim/demographics'
import { IdentityPageDefinition } from 'pages/claim/identity'
import { UnionPageDefinition } from 'pages/claim/union'
import { AbleAndAvailablePageDefinition } from 'pages/claim/able-and-available'
import { PaymentPageDefinition } from 'pages/claim/payment'
import { EducationAndTrainingPageDefinition } from 'pages/claim/education-and-training'

export type PageDefinition = {
  heading: string
  path: string
  initialValues: ClaimantInput
  validationSchema: AnySchema
}

export const pageDefinitions: PageDefinition[] = [
  PersonalPageDefinition,
  ContactPageDefinition,
  DemographicsPageDefinition,
  IdentityPageDefinition,
  // EmployerPageDefinition,
  // EmployerReviewPageDefinition,
  // SelfEmploymentPageDefinition,
  // OtherPayPageDefinition,
  // OccupationPageDefinition,
  EducationAndTrainingPageDefinition,
  UnionPageDefinition,
  AbleAndAvailablePageDefinition,
  // AvailabilityPageDefinition,
  PaymentPageDefinition,
  // ReviewPageDefinition,
]
