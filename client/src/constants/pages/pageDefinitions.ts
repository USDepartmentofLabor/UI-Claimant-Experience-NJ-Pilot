import { AnySchema } from 'yup'
import { ClaimantInput } from 'types/claimantInput'
import { ContactPageDefinition } from 'pages/claim/contact'
import { DemographicPageDefinition } from 'pages/claim/demographic'
import { PaymentPageDefinition } from 'pages/claim/payment'
import { UnionPageDefinition } from 'pages/claim/union'
import { PersonalPageDefinition } from 'pages/claim/personal'
import { IdentityPageDefinition } from 'pages/claim/identity'

export type PageDefinition = {
  heading: string
  path: string
  initialValues: ClaimantInput
  validationSchema: AnySchema
}

export const pageDefinitions: PageDefinition[] = [
  PersonalPageDefinition,
  ContactPageDefinition,
  DemographicPageDefinition,
  IdentityPageDefinition,
  // EmployerPageDefinition,
  // EmployerReviewPageDefinition,
  // SelfEmploymentPageDefinition,
  // OtherPayPageDefinition,
  // OccupationPageDefinition,
  // EducationVocationalRehabPageDefinition,
  UnionPageDefinition,
  // DisabilityPageDefinition,
  // AvailabilityPageDefinition,
  PaymentPageDefinition,
  // ReviewPageDefinition,
]
