import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  ISO_8601_DATE,
  USER_FACING_DATE_INPUT_FORMAT,
} from 'constants/date/format'
import { CENTS_REGEX } from 'constants/currency/format'
import { i18n_claimForm, i18n_common } from 'i18n/i18n'
import { boolean, date, object, string } from 'yup'
import * as states from 'fixtures/states.json'
import { suffixOptions } from 'constants/formOptions'

export const yupAddress = () =>
  object().shape({
    address: string()
      .max(64)
      .required(i18n_common.t('address.address.required')),
    city: string().max(64).required(i18n_common.t('address.city.required')),
    state: string()
      .oneOf(Object.keys(states))
      .required(i18n_common.t('address.state.required')),
    zipcode: string()
      // eslint-disable-next-line security/detect-unsafe-regex
      .matches(/^\d{5}(-\d{4})?$/, i18n_common.t('address.zipcode.format'))
      .required(i18n_common.t('address.zipcode.required')),
  })

export const yupAddressWithoutPOBox = () =>
  object().shape({
    address: string()
      .max(64)
      .matches(
        /^(?!.*(?:(.*((p|post)[-.\s]*(o|off|office)[-.\s]*(box|bin)[-.\s]*)|.*((p |post)[-.\s]*(box|bin)[-.\s]*)))).*$/i,
        i18n_common.t('address.address.pobox')
      )
      .required(i18n_common.t('address.address.required')),
    city: string().max(64).required(i18n_common.t('address.city.required')),
    state: string()
      .oneOf(Object.keys(states))
      .required(i18n_common.t('address.state.required')),
    zipcode: string()
      // eslint-disable-next-line security/detect-unsafe-regex
      .matches(/^\d{5}(-\d{4})?$/, i18n_common.t('address.zipcode.format'))
      .required(i18n_common.t('address.zipcode.required')),
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
    .max(36)
    .matches(
      /^[A-Za-z]+$/,
      i18n_claimForm.t('name.first_name.errors.alphabetical')
    )
    .required(i18n_claimForm.t('name.first_name.required')),
  last_name: string()
    .nullable()
    .max(36)
    .matches(
      /^[A-Za-z]+$/,
      i18n_claimForm.t('name.last_name.errors.alphabetical')
    )
    .required(i18n_claimForm.t('name.last_name.required')),
  middle_initial: string()
    .nullable()
    .matches(
      /[A-Za-z]/,
      i18n_claimForm.t('name.middle_initial.errors.alphabetical')
    )
    .max(1, i18n_claimForm.t('name.middle_initial.errors.max')),
  suffix: string()
    .oneOf([...suffixOptions])
    .nullable(),
})

export const yupPhone = object().shape({
  number: string()
    .matches(
      /^[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4}$/,
      i18n_common.t('phone.number.errors.matches')
    )
    .min(10)
    .max(13)
    .required(i18n_common.t('phone.number.errors.required')),
  sms: boolean(),
})

export const yupPhoneWithSMS = object().shape({
  number: string()
    .matches(
      /^[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4}$/,
      i18n_claimForm.t('contact.claimant_phone.errors.matches')
    )
    .min(10)
    .max(13)
    .required(i18n_claimForm.t('contact.claimant_phone.errors.required')),
  sms: boolean().required(i18n_claimForm.t('contact.sms.errors.required')),
})

export const yupPhoneOptional = object().shape({
  //TODO: transform is a work around for the side nav yup validation which doesn't convert
  // empty strings to undefined like the formik validation does.
  number: string()
    .transform((number) => (!number ? undefined : number))
    .matches(
      /^[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4}$/,
      i18n_claimForm.t('contact.claimant_phone.errors.matches')
    )
    .min(10)
    .max(13),
  sms: boolean(),
})
