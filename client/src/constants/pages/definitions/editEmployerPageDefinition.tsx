import { i18n_claimForm } from 'i18n/i18n'
import * as yup from 'yup'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'

const { t } = i18n_claimForm
const pageSchema = yup.object().shape({})

export const EditEmployerPageDefinition: PageDefinition = {
  path: Routes.CLAIM.EDIT_EMPLOYER,
  heading: t('edit_employer.heading'),
  validationSchema: pageSchema,
}
