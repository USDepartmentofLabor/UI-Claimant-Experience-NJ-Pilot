import { ComponentProps } from 'react'
import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

type PreviousPageButtonProps = {
  onClick: ComponentProps<typeof Button>['onClick']
}

export const PreviousPageButton = ({ onClick }: PreviousPageButtonProps) => {
  const { t } = useTranslation('claimForm')

  return (
    <Button
      type="button"
      data-testid="back-button"
      onClick={onClick}
      className="usa-button usa-button--outline width-auto"
    >
      {t('pagination.previous')}
    </Button>
  )
}
