import dayjs from 'dayjs'

import { ISO_8601_DATE } from 'constants/date/format'

export const formatUserInputDate = (
  initialValue?: string
): string | undefined => {
  if (!initialValue) return undefined

  const dayjsValue = dayjs(initialValue)
  return initialValue && dayjsValue.isValid()
    ? dayjsValue.format(ISO_8601_DATE)
    : initialValue // preserve undefined to show validations later
}
