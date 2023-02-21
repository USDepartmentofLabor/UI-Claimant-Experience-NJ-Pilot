import { object } from 'yup'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { PageDefinition } from 'constants/pages/pageDefinitions'

const validationSchema = object().shape({})

export const ReviewEmployersPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('review_employers.heading'),
  path: Routes.CLAIM.REVIEW_EMPLOYERS,
  validationSchema: validationSchema,
}
