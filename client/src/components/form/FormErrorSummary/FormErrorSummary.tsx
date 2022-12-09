import { Alert } from '@trussworks/react-uswds'
import { FormikErrors } from 'formik'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ClaimantInput } from 'types/claimantInput'

interface IFormErrorSummary {
  errors: FormikErrors<ClaimantInput>
}

export const FormErrorSummary = ({ errors }: IFormErrorSummary) => {
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

const countErrors = (errors: FormikErrors<ClaimantInput>) => {
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
