import { object } from 'yup'
import { i18n_claimForm } from 'i18n/i18n'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'

const validationSchema = object().shape({})

export const AddressVerificationPageDefinition: PageDefinition = {
  path: Routes.CLAIM.ADDRESS_VERIFICATION,
  heading: i18n_claimForm.t('personal.address_confirmation'),
  validationSchema,
}
