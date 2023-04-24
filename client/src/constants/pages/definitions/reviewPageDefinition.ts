import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { boolean, object } from 'yup'

export const ReviewPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('review.heading'),
  path: Routes.CLAIM.REVIEW,
  validationSchema: object().shape({
    certify: boolean()
      .isTrue(i18n_claimForm.t('review.certify.errors.mustBeTrue'))
      .required(i18n_claimForm.t('review.certify.errors.required')),
  }),
}
