import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { PHONE_SKELETON } from 'constants/initialValues'
import { mixed, object, string } from 'yup'
import { yupPhoneOptional, yupPhoneWithSMS } from 'validations/yup/custom'
import {
  interpreterTTYOptions,
  preferredLanguageOptions,
} from '../../formOptions'

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
        .required(
          i18n_claimForm.t('contact.preferred_language.errors.required')
        ),
    }),
    preferred_language_other: mixed().when('preferred_language', {
      is: 'other',
      then: string()
        .max(
          32,
          i18n_claimForm.t('contact.preferred_language.errors.maxLength')
        )
        .required(
          i18n_claimForm.t('contact.preferred_language.errors.required')
        ),
    }),
  }),
}