import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  ISO_8601_DATE,
  USER_FACING_DATE_INPUT_FORMAT,
} from 'constants/date/format'
import { CENTS_REGEX } from 'constants/currency/format'
import { i18n_claimForm, i18n_common } from 'i18n/i18n'
import { boolean, date, object, string } from 'yup'
import { suffixOptions } from 'constants/formOptions'
import { statesAndTerritories } from 'fixtures/states_and_territories'

export const yupAddress = () =>
  object().shape({
    address: string()
      .max(
        64,
        i18n_common.t('address.address.errors.maxLength.address_generic_max')
      )
      .required(i18n_common.t('address.address.errors.required')),
    address2: string()
      .optional()
      .max(64, i18n_common.t('address.address.errors.maxLength')),
    city: string()
      .max(
        64,
        i18n_common.t('address.city.errors.maxLength.address_generic_max')
      )
      .matches(/^([^0-9]*)$/, i18n_common.t('address.city.errors.noNumbers'))
      .required(i18n_common.t('address.city.errors.required')),
    state: string()
      .oneOf(Object.keys(statesAndTerritories))
      .required(i18n_common.t('address.state.errors.required')),
    zipcode: string()
      .matches(
        // eslint-disable-next-line security/detect-unsafe-regex
        /^\d{5}(-\d{4})?$/,
        i18n_common.t('address.zipcode.errors.format')
      )
      .required(i18n_common.t('address.zipcode.errors.required')),
  })

export const yupEmployerAddress = () =>
  object().shape({
    address: string()
      .trim()
      .max(40, i18n_common.t('address.address.errors.maxLength.employer'))
      .required(i18n_common.t('address.address.errors.required')),
    address2: string()
      .trim()
      .max(40, i18n_common.t('address.address.errors.maxLength.employer')),
    address3: string()
      .trim()
      .max(40, i18n_common.t('address.address.errors.maxLength.employer')),
    city: string()
      .max(40, i18n_common.t('address.city.errors.maxLength'))
      .matches(/^([^0-9]*)$/, i18n_common.t('address.city.errors.noNumbers'))
      .required(i18n_common.t('address.city.errors.required')),
    state: string()
      .oneOf(Object.keys(statesAndTerritories))
      .required(i18n_common.t('address.state.errors.required')),
    zipcode: string()
      .matches(
        // eslint-disable-next-line security/detect-unsafe-regex
        /^\d{5}(-\d{4})?$/,
        i18n_common.t('address.zipcode.errors.format')
      )
      .required(i18n_common.t('address.zipcode.errors.required')),
  })

export const yupAddressWithoutPOBox = () =>
  object().shape({
    address: string()
      .max(30, i18n_common.t('address.address.errors.maxLength.residence'))
      .matches(
        /^(?!.*(?:(.*((p|post)[-.\s]*(o|off|office)[-.\s]*(box|bin)[-.\s]*)|.*((p |post)[-.\s]*(box|bin)[-.\s]*)))).*$/i,
        i18n_common.t('address.address.errors.pobox')
      )
      .required(i18n_common.t('address.address.errors.required')),
    address2: string()
      .nullable()
      .optional()
      .max(64, i18n_common.t('address.address.errors.maxLength')),
    city: string()
      .max(19, i18n_common.t('address.city.errors.maxLength.residence'))
      .matches(/^([^0-9]*)$/, i18n_common.t('address.city.errors.noNumbers'))
      .required(i18n_common.t('address.city.errors.required')),
    state: string()
      .oneOf(Object.keys(statesAndTerritories))
      .required(i18n_common.t('address.state.errors.required')),
    zipcode: string()
      .matches(
        // eslint-disable-next-line security/detect-unsafe-regex
        /^\d{5}(-\d{4})?$/,
        i18n_common.t('address.zipcode.errors.format')
      )
      .required(i18n_common.t('address.zipcode.errors.required')),
  })

export const yupAddressWithoutStreet = () =>
  object().shape({
    city: string()
      .max(
        64,
        i18n_common.t('address.city.errors.maxLength.address_generic_max')
      )
      .matches(/^([^0-9]*)$/, i18n_common.t('address.city.errors.noNumbers'))
      .required(i18n_common.t('address.city.errors.required')),
    state: string()
      .oneOf(Object.keys(statesAndTerritories))
      .required(i18n_common.t('address.state.errors.required')),
    zipcode: string()
      .matches(
        // eslint-disable-next-line security/detect-unsafe-regex
        /^\d{5}(-\d{4})?$/,
        i18n_common.t('address.zipcode.errors.format')
      )
      .required(i18n_common.t('address.zipcode.errors.required')),
  })

export const yupDate = (fieldName: string) =>
  date()
    .transform((value, originalValue) => {
      dayjs.extend(customParseFormat)
      return dayjs(originalValue, ISO_8601_DATE, true).isValid()
        ? value
        : date.INVALID_DATE
    })
    .typeError(
      i18n_common.t('date.errors.format', {
        fieldName,
        dateFormat: USER_FACING_DATE_INPUT_FORMAT,
        interpolation: { escapeValue: false }, // allows a slash character
      })
    )

export const yupCurrency = (errorMsg = '') => {
  return string().matches(CENTS_REGEX, errorMsg)
}

export const yupName = object().shape({
  first_name: string()
    .nullable()
    .max(36, i18n_claimForm.t('name.first_name.errors.maxLength'))
    .matches(
      /^[A-Za-z \-']+$/,
      i18n_claimForm.t('name.first_name.errors.alphabetical')
    )
    .required(i18n_claimForm.t('name.first_name.errors.required')),
  last_name: string()
    .nullable()
    .max(36, i18n_claimForm.t('name.last_name.errors.maxLength'))
    .matches(
      /^[A-Za-z \-']+$/,
      i18n_claimForm.t('name.last_name.errors.alphabetical')
    )
    .required(i18n_claimForm.t('name.last_name.errors.required')),
  middle_initial: string()
    .nullable()
    .matches(
      /[A-Za-z \-']/,
      i18n_claimForm.t('name.middle_initial.errors.alphabetical')
    )
    .max(1, i18n_claimForm.t('name.middle_initial.errors.maxLength')),
  suffix: string()
    .oneOf([...suffixOptions])
    .nullable(),
})

export const yupPhone = object().shape({
  number: string()
    .matches(
      /^\d{3}[-.]\d{3}[-.]\d{4}$/,
      i18n_claimForm.t('contact.claimant_phone.errors.matches')
    )
    .max(12)
    .required(i18n_claimForm.t('contact.claimant_phone.errors.required')),
  sms: boolean().nullable(),
})

export const yupPhoneWithSMS = object().shape({
  number: string()
    .matches(
      /^\d{3}[-.]\d{3}[-.]\d{4}$/,
      i18n_claimForm.t('contact.claimant_phone.errors.matches')
    )
    .max(12)
    .required(i18n_claimForm.t('contact.claimant_phone.errors.required')),
  sms: boolean()
    .nullable()
    .required(i18n_claimForm.t('contact.sms.errors.required')),
})

export const yupPhoneOptional = object().shape({
  //TODO: transform is a work around for the side nav yup validation which doesn't convert
  // empty strings to undefined like the formik validation does.
  number: string()
    .transform((number) => (!number ? undefined : number))
    .matches(
      /^\d{3}[-.]\d{3}[-.]\d{4}$/,
      i18n_claimForm.t('contact.claimant_phone.errors.matches')
    )
    .max(12),
  sms: boolean().nullable(),
})
