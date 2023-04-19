import { ChangeEventHandler, ReactNode } from 'react'

import { useTranslation } from 'react-i18next'
import { TextField } from 'components/form/fields/TextField/TextField'
import { PhoneNumberField } from 'components/form/PhoneNumberField/PhoneNumberField'
import { ContactInput } from 'types/claimantInput'

import {
  interpreterTTYOptions,
  preferredLanguageOptions,
  UNTOUCHED_RADIO_VALUE,
} from 'constants/formOptions'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import formStyles from 'components/form/form.module.scss'
import { VerifiedField } from 'components/form/VerifiedFields/VerifiedField/VerifiedField'
import { VerifiedFields } from 'components/form/VerifiedFields/VerifiedFields'
import { formatStoredToDisplayPhone } from 'utils/phone/format'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'

import { NextPageWithLayout } from 'pages/_app'
import { ContactPageDefinition } from 'constants/pages/definitions/contactPageDefinition'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import { PHONE_SKELETON } from 'constants/initialValues'

const pageDefinition = ContactPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const pageInitialValues = {
  email: '',
  claimant_phone: { ...PHONE_SKELETON },
  alternate_phone: { number: '', sms: UNTOUCHED_RADIO_VALUE },
  interpreter_required: UNTOUCHED_RADIO_VALUE,
  preferred_language: UNTOUCHED_RADIO_VALUE,
  preferred_language_other: '',
}

const Contact: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'contact',
  })

  return (
    <ClaimFormik<ContactInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values, clearField, clearFields, initialValues }) => {
        const handleInterpreterRequiredChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value !== 'interpreter') {
            await clearFields({
              preferred_language: pageInitialValues.preferred_language,
              preferred_language_other:
                pageInitialValues.preferred_language_other,
            })
          }
        }

        const handlePreferredLanguageChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'other') {
            await clearField(
              'preferred_language_other',
              pageInitialValues.preferred_language_other
            )
          }
        }

        return (
          <>
            {(initialValues.claimant_phone.number || values.email) && (
              <VerifiedFields>
                {values.email && (
                  <VerifiedField
                    label={t('email.label')}
                    value={values.email}
                  />
                )}
                {initialValues.claimant_phone.number && (
                  <VerifiedField
                    label={t('claimant_phone.label')}
                    value={formatStoredToDisplayPhone(
                      initialValues.claimant_phone.number
                    )}
                  />
                )}
              </VerifiedFields>
            )}
            <PhoneNumberField
              name="claimant_phone"
              label={t('claimant_phone.label')}
              showSMS={true}
            />
            <PhoneNumberField
              name="alternate_phone"
              label={t('alternate_phone.label')}
              showSMS={false}
            />
            <RadioField
              name="interpreter_required"
              legend={t('interpreter_required.label')}
              className={formStyles.field}
              options={interpreterTTYOptions.map((option) => {
                return {
                  label: t(`interpreter_required.options.${option}`),
                  value: option,
                }
              })}
              onChange={handleInterpreterRequiredChange}
            />

            {values.interpreter_required === 'interpreter' && (
              <>
                <RadioField
                  name="preferred_language"
                  legend={t('preferred_language.label')}
                  className={formStyles.field}
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
                    label={t('other_language.label')}
                  />
                )}
              </>
            )}
            <ClaimFormButtons nextStep={nextPage.heading}>
              <BackButton previousPage={previousPage.path} />
              <NextButton nextPage={nextPage.path} />
            </ClaimFormButtons>
          </>
        )
      }}
    </ClaimFormik>
  )
}

Contact.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Contact
