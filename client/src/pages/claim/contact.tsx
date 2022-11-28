import { ChangeEventHandler } from 'react'
import { NextPage } from 'next'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'
import { TextField } from 'components/form/fields/TextField/TextField'
import { PhoneNumberField } from 'components/form/PhoneNumberField/PhoneNumberField'
import { ClaimantInput } from 'types/claimantInput'
import { PHONE_SKELETON } from 'constants/initialValues'
import { useClearFields } from 'hooks/useClearFields'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { mixed, object, string } from 'yup'
import {
  interpreterTTYOptions,
  preferredLanguageOptions,
} from 'constants/formOptions'
import { Fieldset } from '@trussworks/react-uswds'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import formStyles from 'components/form/form.module.scss'
import { yupPhoneOptional, yupPhoneWithSMS } from 'validations/yup/custom'
import { VerifiedField } from 'components/form/VerifiedFields/VerifiedField/VerifiedField'
import { VerifiedFields } from 'components/form/VerifiedFields/VerifiedFields'
import { formatStoredToDisplayPhone } from 'utils/phone/format'

const Contact: NextPage = () => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'contact',
  })
  const { values, initialValues, setValues } = useFormikContext<ClaimantInput>()
  const { clearField } = useClearFields()

  const handleAlternatePhoneChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.currentTarget.value === '') {
      setValues({ ...values, alternate_phone: undefined })
    }
  }
  const handleInterpreterRequiredChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value !== 'no_interpreter_tty') {
      clearField('preferred_language')
      clearField('preferred_language_other')
    }
  }

  const handlePreferredLanguageChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.target.value === 'other') {
      clearField('preferred_language_other')
    }
  }

  return (
    <>
      <VerifiedFields>
        <VerifiedField label={t('email.label')} value={values.email} />
        {initialValues.claimant_phone?.number && (
          <VerifiedField
            label={t('claimant_phone.label')}
            value={formatStoredToDisplayPhone(
              initialValues.claimant_phone?.number
            )}
          />
        )}
      </VerifiedFields>
      <PhoneNumberField
        name="claimant_phone"
        label={t('claimant_phone.label')}
        showSMS={true}
      />
      <PhoneNumberField
        name="alternate_phone"
        label={t('alternate_phone.label')}
        showSMS={false}
        onChange={handleAlternatePhoneChange}
      />
      <Fieldset
        legend={t('interpreter_required.label')}
        className={formStyles.field}
      >
        <RadioField
          name="interpreter_required"
          options={interpreterTTYOptions.map((option) => {
            return {
              label: t(`interpreter_required.options.${option}`),
              value: option,
            }
          })}
          onChange={handleInterpreterRequiredChange}
        />
      </Fieldset>
      {values.interpreter_required === 'interpreter' && (
        <Fieldset
          legend={t('preferred_language.label')}
          className={formStyles.field}
        >
          <RadioField
            name="preferred_language"
            options={preferredLanguageOptions.map((option) => {
              return {
                label: t(`preferred_language.options.${option}`),
                value: option,
              }
            })}
            onChange={handlePreferredLanguageChange}
          />
          {values.preferred_language === 'other' && (
            <TextField
              labelled-by="preferred_language.other"
              name="preferred_language_other"
              type="text"
              label={t('other_language')}
            />
          )}
        </Fieldset>
      )}
    </>
  )
}

export const ContactPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('contact.heading'),
  path: Routes.CLAIM.CONTACT,
  initialValues: {
    claimant_phone: { ...PHONE_SKELETON },
    alternate_phone: undefined,
    interpreter_required: undefined,
    preferred_language: undefined,
    preferred_language_other: undefined,
  },
  validationSchema: object().shape({
    claimant_phone: yupPhoneWithSMS,
    alternate_phone: yupPhoneOptional,
    interpreter_required: mixed()
      .oneOf([...interpreterTTYOptions])
      .required(i18n_claimForm.t('contact.interpreter_required.required')),
    preferred_language: mixed().when('interpreter_required', {
      is: 'interpreter',
      then: string()
        .oneOf([...preferredLanguageOptions])
        .required(i18n_claimForm.t('contact.preferred_language.required')),
    }),
    preferred_language_other: mixed().when('preferred_language', {
      is: 'other',
      then: string()
        .max(32)
        .required(i18n_claimForm.t('contact.preferred_language.required')),
    }),
  }),
}

export default Contact
