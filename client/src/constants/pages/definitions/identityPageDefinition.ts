import { i18n_claimForm } from 'i18n/i18n'
import { boolean, object, string } from 'yup'
import { authorizationTypeOptions } from 'constants/formOptions'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'

const { t } = i18n_claimForm
const pageSchema = object().shape({
  // ssn: string()
  //   .matches(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/, t('ssn.errors.badFormat'))
  //   .required(t('ssn.errors.required')),
  // birthdate: yupDate(t('birthdate.label'))
  //   .max(dayjs(new Date()).format('YYYY-MM-DD'), t('birthdate.errors.maxDate'))
  //   .required(t('birthdate.errors.required')),
  drivers_license_or_state_id_number: string().required(
    t('drivers_license_or_state_id_number.errors.required')
  ),
  authorized_to_work: boolean().required(
    t('work_authorization.authorized_to_work.errors.required')
  ),
  not_authorized_to_work_explanation: string().when('authorized_to_work', {
    is: false,
    then: (schema) =>
      schema.required(
        t(
          'work_authorization.not_authorized_to_work_explanation.errors.required'
        )
      ),
  }),
  authorization_type: string().when('authorized_to_work', {
    is: true,
    then: (schema) =>
      schema
        .oneOf([...authorizationTypeOptions])
        .required(t('work_authorization.authorization_type.errors.required')),
  }),
  alien_registration_number: string().when('authorization_type', {
    is: (alienRegistrationType: string) =>
      alienRegistrationType &&
      alienRegistrationType !== 'US_citizen_or_national',
    then: (schema) =>
      schema
        .matches(
          /^[0-9]{3}-?[0-9]{3}-?[0-9]{3}$/,
          t('work_authorization.alien_registration_number.errors.format')
        )
        .required(
          t('work_authorization.alien_registration_number.errors.required')
        ),
  }),
})

export const IdentityPageDefinition: PageDefinition = {
  heading: t('identity.heading'),
  path: Routes.CLAIM.IDENTITY,
  initialValues: {
    birthdate: '',
    authorized_to_work: undefined,
    not_authorized_to_work_explanation: undefined,
    authorization_type: undefined,
    alien_registration_number: undefined,
    drivers_license_or_state_id_number: '',
  },
  validationSchema: pageSchema,
}
