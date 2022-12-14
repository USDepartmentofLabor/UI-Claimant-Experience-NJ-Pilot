import { ComponentProps, MouseEventHandler } from 'react'
import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useFormikContext } from 'formik'
import { Employer } from 'types/claimantInput'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'

type PreviousPageButtonProps = {
  previousPage: string
  index: string
} & Omit<ComponentProps<typeof Button>, 'children' | 'type'>

export const EmployerBackButton = ({
  previousPage,
  index,
  onClick,
  disabled,
  ...remainingButtonProps
}: PreviousPageButtonProps) => {
  const router = useRouter()
  const { t } = useTranslation('claimForm')
  const { modifyEmployerAndSaveClaimFormValues } = useSaveClaimFormValues()
  const { values, isSubmitting } = useFormikContext<Employer>()

  const handleGoBack: MouseEventHandler<HTMLButtonElement> = () => {
    modifyEmployerAndSaveClaimFormValues(values, index).then(async () => {
      await router.push(previousPage)
    })
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (onClick) {
      onClick(e)
    }
    handleGoBack(e)
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
