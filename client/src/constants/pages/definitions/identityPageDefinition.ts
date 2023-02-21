import { i18n_claimForm } from 'i18n/i18n'
import { boolean, mixed, object, ref, string } from 'yup'
import {
  authorizationTypeOptions,
  countryOfOriginOptions,
} from 'constants/formOptions'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
import { yupDate, yupName } from 'validations/yup/custom'
import dayjs from 'dayjs'

const { t } = i18n_claimForm
const pageSchema = object().shape({
  birthdate: yupDate(t('birthdate.label'))
    .max(dayjs(new Date()).format('YYYY-MM-DD'), t('birthdate.errors.maxDate'))
    .required(t('birthdate.errors.required')),
  has_nj_issued_id: boolean()
    .nullable()
    .required(t('has_nj_issued_id.errors.required')),
  drivers_license_or_state_id_number: string().when('has_nj_issued_id', {
    is: true,
    then: (schema) =>
      schema
        .matches(
          /^[a-zA-Z][\d]{14}$/,
          t('drivers_license_or_state_id_number.errors.matches')
        )
        .required(t('drivers_license_or_state_id_number.errors.required')),
  }),
  authorization_type: string()
    .oneOf([...authorizationTypeOptions])
    .nullable()
    .required(t('work_authorization.authorization_type.errors.required')),
  employment_authorization_document_name: mixed().when('authorization_type', {
    is: (alienRegistrationType: string) =>
      alienRegistrationType &&
      alienRegistrationType !== 'US_citizen_or_national',
    then: yupName,
  }),
  alien_registration_number: string().when('authorization_type', {
    is: (alienRegistrationType: string) =>
      alienRegistrationType &&
      alienRegistrationType !== 'US_citizen_or_national',
    then: (schema) =>
      schema
        .matches(
          /^[\d]{7,9}$/,
          t('work_authorization.alien_registration_number.errors.format')
        )
        .required(
          t('work_authorization.alien_registration_number.errors.required')
        ),
  }),
  LOCAL_re_enter_alien_registration_number: string().when(
    'authorization_type',
    {
      is: (alienRegistrationType: string) =>
        alienRegistrationType &&
        alienRegistrationType !== 'US_citizen_or_national',
      then: (schema) =>
        schema
          .oneOf(
            [ref('alien_registration_number'), null],
            i18n_claimForm.t(
              'work_authorization.re_enter_alien_registration_number.errors.mustMatch'
            )
          )
          .required(
            i18n_claimForm.t(
              'work_authorization.re_enter_alien_registration_number.errors.required'
            )
          ),
    }
  ),
  country_of_origin: string()
    .oneOf([...countryOfOriginOptions])
    .when('authorization_type', {
      is: (alienRegistrationType: string) =>
        alienRegistrationType &&
        alienRegistrationType !== 'US_citizen_or_national',
      then: string().required(
        i18n_claimForm.t('work_authorization.country_of_origin.errors.required')
      ),
    }),
  employment_authorization_start_date: mixed().when('authorization_type', {
    is: (alienRegistrationType: string) =>
      alienRegistrationType === 'employment_authorization_or_card_or_doc',
    then: yupDate(
      i18n_claimForm.t(
        'work_authorization.employment_authorization_start_date.label'
      )
    )
      .max(
        dayjs(new Date()).format('YYYY-MM-DD'),
        i18n_claimForm.t(
          'work_authorization.employment_authorization_start_date.errors.maxDate'
        )
      )
      .required(
        i18n_claimForm.t(
          'work_authorization.employment_authorization_start_date.errors.required'
        )
      ),
  }),
  employment_authorization_end_date: mixed().when('authorization_type', {
    is: (alienRegistrationType: string) =>
      alienRegistrationType === 'employment_authorization_or_card_or_doc',
    then: yupDate(
      i18n_claimForm.t(
        'work_authorization.employment_authorization_end_date.label'
      )
    )
      .max(
        dayjs(new Date()).format('YYYY-MM-DD'),
        i18n_claimForm.t(
          'work_authorization.employment_authorization_end_date.errors.maxDate'
        )
      )
      .when('employment_authorization_start_date', {
        is: (dateValue: string | undefined) => {
          return !!dateValue
        },
        then: (schema) =>
          schema.min(
            ref('employment_authorization_start_date'),
            i18n_claimForm.t(
              'work_authorization.employment_authorization_end_date.errors.minDate'
            )
          ),
      })
      .required(
        i18n_claimForm.t(
          'work_authorization.employment_authorization_end_date.errors.required'
        )
      ),
  }),
})

export const IdentityPageDefinition: PageDefinition = {
  heading: t('identity.heading'),
  path: Routes.CLAIM.IDENTITY,
  validationSchema: pageSchema,
}
