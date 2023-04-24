import { ComponentProps, MouseEventHandler } from 'react'
import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { FormikValues, useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'

type PreviousPageButtonProps<Values> = {
  previousPage: string
  handleSave?: (values: Values) => Promise<void>
} & Omit<ComponentProps<typeof Button>, 'children' | 'type'>

export const BackButton = <
  Values extends FormikValues = Partial<ClaimantInput>
>({
  previousPage,
  onClick,
  disabled,
  handleSave,
  ...remainingButtonProps
}: PreviousPageButtonProps<Values>) => {
  const router = useRouter()
  const { t } = useTranslation('claimForm')
  const { appendAndSaveClaimFormValues } = useSaveClaimFormValues()
  const { values, isSubmitting } = useFormikContext<Values>()

  const handleGoBack: MouseEventHandler<HTMLButtonElement> = () => {
    const saveFunction = handleSave ? handleSave : appendAndSaveClaimFormValues
    saveFunction(values).then(async () => {
      await router.push(previousPage)
    })
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    handleGoBack(e)
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Button
      type="button"
      data-testid="back-button"
      className="usa-button usa-button--outline width-auto"
      disabled={disabled || isSubmitting}
      {...remainingButtonProps}
      onClick={handleClick}
    >
      {t('pagination.previous')}
    </Button>
  )
}
