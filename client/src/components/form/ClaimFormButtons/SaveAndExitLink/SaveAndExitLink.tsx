import { ComponentProps } from 'react'
import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

type SaveAndExitLinkProps = Omit<
  ComponentProps<typeof Button>,
  'children' | 'type'
>

export const SaveAndExitLink = (props: SaveAndExitLinkProps) => {
  const { t } = useTranslation('claimForm')

  return (
    <Button
      className="width-auto"
      type="button"
      unstyled
      data-testid="save-and-exit-button"
      {...props}
    >
      {t('pagination.save_and_exit')}
    </Button>
  )
}
