import { useState } from 'react'
import { Checkbox as UswdsCheckbox } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import dayjs from 'dayjs'
import TextField from 'components/form/fields/TextField/TextField'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import TextAreaField from 'components/form/fields/TextAreaField/TextAreaField'
import { useClearFields } from 'hooks/useClearFields'
import { string, object, boolean } from 'yup'
import { yupDate } from 'validations/yup/custom'
import { StatesDropdown } from 'components/form/StatesDropdown/StatesDropdown'
import { i18n_claimForm } from 'i18n/i18n'
import states from 'fixtures/states.json'
import { authorizationTypeOptions } from 'constants/formOptions'
import { useFormikContext } from 'formik'
import { Routes } from 'constants/routes'
import { NextPage } from 'next'
import { ClaimantInput } from 'types/claimantInput'

import styles from 'styles/pages/claim/identity.module.scss'

export const Identity: NextPage = () => {
  const { t } = useTranslation('claimForm')
  const { values } = useFormikContext<ClaimantInput>()
  const [showSsn, setShowSsn] = useState(false)
  const showWorkAuthorizationFields =
    values.work_authorization?.authorized_to_work

  const showNotAllowedToWorkInUSExplanation =
    values.work_authorization?.authorized_to_work === false

  const showAlienRegistrationNumber =
    values.work_authorization?.authorization_type &&
    values.work_authorization.authorization_type !== 'US_citizen_or_national'

  const handleShowSsn = () => {
    setShowSsn(!showSsn)
  }
  useClearFields(!showWorkAuthorizationFields, [
    'work_authorization.authorization_type',
    'work_authorization.alien_registration_number',
  ])

  useClearFields(
    !showNotAllowedToWorkInUSExplanation,
    'work_authorization.not_authorized_to_work_explanation'
  )

  useClearFields(
    !showAlienRegistrationNumber,
    'work_authorization.alien_registration_number'
  )

  return (
    <>
      <div className="position-relative">
        <TextField
          label={t('ssn.label')}
          name="ssn"
          type={showSsn ? 'text' : 'password'}
          hint={t('ssn.hint')}
          fieldAddon={
            <UswdsCheckbox
              id="show-ssn"
              name="LOCAL_showSsn"
              label={t('ssn.showSsnLabel')}
              checked={showSsn}
              onChange={handleShowSsn}
              tile={true}
              className={styles.showSsn}
            />
          }
        />
      </div>
      <DateInputField legend={t('birthdate.label')} name="birthdate" />
      <TextField
        label={t('state_credential.drivers_license_or_state_id_number.label')}
        name="state_credential.drivers_license_or_state_id_number"
        type="text"
      />
      <StatesDropdown
        label={t('state_credential.issuer.label')}
        name="state_credential.issuer"
        startEmpty
      />
      <YesNoQuestion
        question={t('work_authorization.authorized_to_work.label')}
        name="work_authorization.authorized_to_work"
      />
      {showNotAllowedToWorkInUSExplanation && (
        <TextAreaField
          label={t(
            'work_authorization.not_authorized_to_work_explanation.label'
          )}
          name="work_authorization.not_authorized_to_work_explanation"
        />
      )}
      {showWorkAuthorizationFields && (
        <>
          <DropdownField
            label={t('work_authorization.authorization_type.label')}
            name="work_authorization.authorization_type"
            startEmpty
            options={authorizationTypeOptions.map((option) => ({
              label: t(
                `work_authorization.authorization_type.options.${option}`
              ),
              value: option,
            }))}
          />
          {showAlienRegistrationNumber && (
            <TextField
              label={t('work_authorization.alien_registration_number.label')}
              name="work_authorization.alien_registration_number"
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
  ssn: string()
    .matches(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/, t('ssn.errors.badFormat'))
    .required(t('ssn.errors.required')),
  birthdate: yupDate(t('birthdate.label')).max(
    dayjs(new Date()).format('YYYY-MM-DD'),
    t('birthdate.errors.maxDate')
  ),
  state_credential: object().shape({
    drivers_license_or_state_id_number: string().required(
      t('state_credential.drivers_license_or_state_id_number.errors.required')
    ),
    issuer: string()
      .oneOf(Object.keys(states))
      .required(t('state_credential.issuer.errors.required')),
  }),

  work_authorization: object().shape({
    authorized_to_work: boolean().required(
      t('work_authorization.authorized_to_work.errors.required')
    ),
    not_authorized_to_work_explanation: string().when('authorized_to_work', {
      is: false,
      then: string().required(
        t(
          'work_authorization.not_authorized_to_work_explanation.errors.required'
        )
      ),
    }),
    authorization_type: string().when('authorized_to_work', {
      is: true,
      then: string()
        .oneOf([...authorizationTypeOptions])
        .required(t('work_authorization.authorization_type.errors.required')),
    }),
    alien_registration_number: string().when('authorization_type', {
      is: (alienRegistrationType: string) =>
        alienRegistrationType &&
        alienRegistrationType !== 'US_citizen_or_national',
      then: string()
        .matches(
          /^[0-9]{3}-?[0-9]{3}-?[0-9]{3}$/,
          t('work_authorization.alien_registration_number.errors.format')
        )
        .required(
          t('work_authorization.alien_registration_number.errors.required')
        ),
    }),
  }),
})

export const IdentityPageDefinition: PageDefinition = {
  heading: t('identity.heading'),
  path: Routes.CLAIM.IDENTITY,
  initialValues: {
    birthdate: '',
    ssn: '',
    work_authorization: {
      authorized_to_work: undefined,
      not_authorized_to_work_explanation: undefined,
      authorization_type: undefined,
      alien_registration_number: undefined,
    },
    state_credential: {
      drivers_license_or_state_id_number: '',
      issuer: undefined,
    },
  },
  validationSchema: pageSchema,
}
