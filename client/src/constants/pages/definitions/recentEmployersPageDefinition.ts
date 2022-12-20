import { array, boolean, object } from 'yup'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { PageDefinition } from 'constants/pages/pageDefinitions'

const validationSchema = object().shape({
  employers: array().of(
    object().shape({
      is_imported: boolean(),
      is_employer: boolean().when('is_imported', {
        is: true,
        then: boolean().required(
          i18n_claimForm.t('recent_employers.is_employer.errors.required')
        ),
      }),
    })
  ),
})

const previousPage = () => {
  return Routes.CLAIM.DEMOGRAPHICS
}

const nextPage = () => {
  return Routes.CLAIM.IDENTITY
}

export const RecentEmployersPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('recent_employers.heading'),
  path: Routes.CLAIM.RECENT_EMPLOYERS,
  initialValues: {},
  validationSchema: validationSchema,
  previousPage: previousPage,
  nextPage: nextPage,
}