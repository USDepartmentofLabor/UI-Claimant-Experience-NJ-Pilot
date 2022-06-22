import { TFunction } from 'react-i18next'
import * as yup from 'yup'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  ISO_8601_DATE,
  USER_FACING_DATE_INPUT_FORMAT,
} from 'constants/date/format'
import { CENTS_REGEX } from 'constants/currency/format'

export const yupDate = (t: TFunction<'claimForm'>, fieldName: string) =>
  yup
    .date()
    .transform((value, originalValue) => {
      dayjs.extend(customParseFormat)
      return dayjs(originalValue, ISO_8601_DATE, true).isValid()
        ? value
        : yup.date.INVALID_DATE
    })
    .typeError(
      t('date.typeError', {
        fieldName,
        dateFormat: USER_FACING_DATE_INPUT_FORMAT,
      })
    )
    .required(t('date.required', { fieldName }))

export const yupCurrency = (errorMsg = '') => {
  return yup.string().matches(CENTS_REGEX, errorMsg)
}
