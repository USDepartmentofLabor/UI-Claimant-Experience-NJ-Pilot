import { ComponentProps } from 'react'
import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

type SaveAndExitLinkProps = {
  onClick: ComponentProps<typeof Button>['onClick']
}

export const SaveAndExitLink = ({ onClick }: SaveAndExitLinkProps) => {
  const { t } = useTranslation('claimForm')

  return (
    <Button
      className="width-auto"
      type="button"
      onClick={onClick}
      unstyled
      data-testid="save-and-exit-button"
    >
      {t('pagination.save_and_exit')}
    </Button>
  )
}
