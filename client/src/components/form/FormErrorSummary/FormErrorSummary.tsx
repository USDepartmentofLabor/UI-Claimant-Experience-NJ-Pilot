import { Alert } from '@trussworks/react-uswds'
import { FormikErrors, FormikValues } from 'formik'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface IFormErrorSummary<T extends FormikValues> {
  errors: FormikErrors<T>
}

export const FormErrorSummary = <T extends FormikValues>({
  errors,
}: IFormErrorSummary<T>) => {
  const { t } = useTranslation('claimForm')
  const count = useMemo(() => countErrors(errors), [errors]) || 0

  return (
    <Alert
      headingLevel="h4"
      role="alert"
      type="error"
      slim
      data-testid="form-error-summary"
    >
      {t('validation_alert', { count })}
    </Alert>
  )
}

const countErrors = <T extends FormikValues>(errors: FormikErrors<T>) => {
  let totalErrors = 0
  const objects: Record<string, any>[] = [errors]
  while (objects.length) {
    const cur = objects.pop()
    if (!cur) {
      continue
    }
    Object.values(cur).forEach((val) => {
      if (typeof val === 'string') {
        totalErrors++
      } else if (typeof val === 'object') {
        objects.push(val)
      }
    })
  }
  return totalErrors
}
