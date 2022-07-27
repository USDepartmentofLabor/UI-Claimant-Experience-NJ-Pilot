import { NextPage } from 'next'
import { useTranslation } from 'react-i18next'
import { FieldArray, useFormikContext } from 'formik'
import { TextField } from 'components/form/fields/TextField/TextField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { CheckboxField } from 'components/form/fields/CheckboxField/CheckboxField'
import { PhoneNumberField } from 'components/form/PhoneNumberField/PhoneNumberField'
import { ClaimantInput } from 'types/claimantInput'
import { PHONE_SKELETON } from 'constants/initialValues'
import { useClearFields } from 'hooks/useClearFields'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { array, boolean, object, string } from 'yup'
import { yupPhone } from 'validations/yup/custom'

const Contact: NextPage = () => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'contact',
  })
  const { values } = useFormikContext<ClaimantInput>()
  const { clearField } = useClearFields()

  const handleInterpreterRequiredChange = () => {
    if (values.interpreter_required === false) {
      clearField('preferred_language')
    }
  }

  return (
    <>
      {/*<VerifiedFields fields={['email', 'phone']} /> implement when designed and hooked up to api */}
      <FieldArray
        name="phones"
        render={(arrayHelpers) => (
          <>
            <PhoneNumberField name="phones[0]" showSMS={false} />
            <CheckboxField
              name="LOCAL_more_phones"
              data-testid="LOCAL_more_phones"
              label={t('more_phones')}
              onChange={(e) => {
                if (e.target.checked) {
                  values.phones?.length === 1 &&
                    arrayHelpers.push({ ...PHONE_SKELETON })
                } else {
                  const shouldRemoveSecondPhone =
                    (values.phones?.length || 0) >= 2
                  shouldRemoveSecondPhone && arrayHelpers.remove(1)
                }
              }}
            />
            {values.LOCAL_more_phones && (
              <PhoneNumberField name="phones[1]" showSMS={false} />
            )}
          </>
        )}
      />
      <TextField
        name="email"
        type="text"
        label={t('email')}
        disabled
        readOnly
      />
      <YesNoQuestion
        question={t('interpreter_required.label')}
        name="interpreter_required"
        onChange={handleInterpreterRequiredChange}
      />
      {values.interpreter_required && (
        <TextField
          label={t('preferred_language.label')}
          name="preferred_language"
          type="text"
        />
      )}
    </>
  )
}

export const ContactPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('contact.heading'),
  path: Routes.CLAIM.CONTACT,
  initialValues: {
    email: undefined,
    phones: [{ ...PHONE_SKELETON }],
    LOCAL_more_phones: undefined,
    interpreter_required: undefined,
  },
  validationSchema: object().shape({
    // email is not editable, so omit required() but include the schema def just in case.
    email: string().email(),
    phones: array().when('LOCAL_more_phones', {
      is: true,
      then: array().of(yupPhone).min(2).required(),
      otherwise: array().of(yupPhone).min(1).required(),
    }),
    interpreter_required: boolean().required(
      i18n_claimForm.t('contact.interpreter_required.required')
    ),
    preferred_language: string().when('interpreter_required', {
      is: true,
      then: string().required(
        i18n_claimForm.t('contact.preferred_language.required')
      ),
    }),
  }),
}

export default Contact
