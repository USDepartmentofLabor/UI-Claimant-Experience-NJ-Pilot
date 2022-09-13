import dayjs from 'dayjs'

import { DATE_FORMAT, ISO_8601_DATE } from 'constants/date/format'

export const formatUserInputDate = (
  initialValue?: string
): string | undefined => {
  if (!initialValue) return undefined

  const dayjsValue = dayjs(initialValue)
  return initialValue && dayjsValue.isValid()
    ? dayjsValue.format(ISO_8601_DATE)
    : initialValue // preserve undefined to show validations later
}

export const formatStoredDateToDisplayDate = (
  storedValue?: string
): string | undefined => {
  if (!storedValue) return undefined

  const dayjsValue = dayjs(storedValue)
  return storedValue && dayjsValue.isValid()
    ? dayjsValue.format(DATE_FORMAT)
    : storedValue // preserve undefined to show validations later
}
