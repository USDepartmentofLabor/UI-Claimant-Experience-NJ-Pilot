import * as yup from 'yup'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  ISO_8601_DATE,
  USER_FACING_DATE_INPUT_FORMAT,
} from 'constants/date/format'
import { CENTS_REGEX } from 'constants/currency/format'
import { i18n_common } from 'i18n/i18n'
import { boolean, date, string } from 'yup'

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
      })
    )
    .required(i18n_common.t('date.errors.required', { fieldName }))

export const yupCurrency = (errorMsg = '') => {
  return string().matches(CENTS_REGEX, errorMsg)
}

export const yupPhone = yup.object().shape({
  number: string()
    .matches(
      /[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4}/,
      i18n_common.t('phone.number.errors.matches')
    )
    .min(10)
    .max(32)
    .required(i18n_common.t('phone.number.errors.required')),
  type: string(),
  sms: boolean(),
})
