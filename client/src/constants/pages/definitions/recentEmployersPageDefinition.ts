import { array, boolean, object } from 'yup'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { PageDefinition } from 'constants/pages/pageDefinitions'

const validationSchema = object().shape({
  recent_employers: array().of(
    object().shape({
      worked_for_imported_employer_in_last_18mo: boolean().required(
        i18n_claimForm.t(
          'recent_employers.worked_for_imported_employer_in_last_18mo.errors.required'
        )
      ),
    })
  ),
})

// This page definition is only useful for claim progress.
// These initial values are not actually used.
// A broader decoupling from PageDefinitions may result in this being able to be removed
export const RecentEmployersPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('recent_employers.heading'),
  path: Routes.CLAIM.RECENT_EMPLOYERS,
  initialValues: {}, // This is not used as the page is a custom formik instance
  validationSchema: validationSchema,
}
