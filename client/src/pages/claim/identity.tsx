import { useTranslation } from 'react-i18next'

import { PageDefinition } from 'constants/pages/pageDefinitions'
import TextField from 'components/form/fields/TextField/TextField'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import TextAreaField from 'components/form/fields/TextAreaField/TextAreaField'
import { useClearFields } from 'hooks/useClearFields'
import { string, object, boolean } from 'yup'
import { i18n_claimForm } from 'i18n/i18n'
import { authorizationTypeOptions } from 'constants/formOptions'
import { useFormikContext } from 'formik'
import { Routes } from 'constants/routes'
import { NextPage } from 'next'
import { ClaimantInput } from 'types/claimantInput'
import { VerifiedFields } from 'components/form/VerifiedFields/VerifiedFields'
import { VerifiedField } from 'components/form/VerifiedFields/VerifiedField/VerifiedField'
import { formatStoredDateToDisplayDate } from 'utils/date/format'

export const Identity: NextPage = () => {
  const { t } = useTranslation('claimForm')
  const { values, initialValues } = useFormikContext<ClaimantInput>()
  const { clearField, clearFields } = useClearFields()

  const showWorkAuthorizationFields = values.authorized_to_work

  const showAlienRegistrationNumber =
    values.authorization_type &&
    values.authorization_type !== 'US_citizen_or_national'

  const showNotAllowedToWorkInUSExplanation =
    values.authorized_to_work === false

  const handleAuthorizedToWorkChange = () => {
    if (!showWorkAuthorizationFields) {
      clearFields(['authorization_type', 'alien_registration_number'])
    }
    if (!showNotAllowedToWorkInUSExplanation) {
      clearField('not_authorized_to_work_explanation')
    }
  }

  const handleAuthorizationTypeChange = () => {
    if (!showAlienRegistrationNumber) {
      clearField('alien_registration_number')
    }
  }

  return (
    <>
      <VerifiedFields>
        {initialValues.ssn && (
          <VerifiedField label={t('ssn.label')} value={initialValues.ssn} />
        )}
        {initialValues.birthdate && (
          <VerifiedField
            label={t('birthdate.label')}
            value={formatStoredDateToDisplayDate(initialValues.birthdate)}
          />
        )}
      </VerifiedFields>
      <TextField
        label={t('drivers_license_or_state_id_number.label')}
        name="drivers_license_or_state_id_number"
        type="text"
      />
      <YesNoQuestion
        question={t('work_authorization.authorized_to_work.label')}
        name="authorized_to_work"
        onChange={handleAuthorizedToWorkChange}
      />
      {showNotAllowedToWorkInUSExplanation && (
        <TextAreaField
          label={t(
            'work_authorization.not_authorized_to_work_explanation.label'
          )}
          name="not_authorized_to_work_explanation"
        />
      )}
      {showWorkAuthorizationFields && (
        <>
          <DropdownField
            label={t('work_authorization.authorization_type.label')}
            name="authorization_type"
            startEmpty
            options={authorizationTypeOptions.map((option) => ({
              label: t(
                `work_authorization.authorization_type.options.${option}`
              ),
              value: option,
            }))}
            onChange={handleAuthorizationTypeChange}
          />
          {showAlienRegistrationNumber && (
            <TextField
              label={t('work_authorization.alien_registration_number.label')}
              name="alien_registration_number"
              type="text"
            />
          )}
        </>
      )}
    </>
  )
}

export default Identity
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
