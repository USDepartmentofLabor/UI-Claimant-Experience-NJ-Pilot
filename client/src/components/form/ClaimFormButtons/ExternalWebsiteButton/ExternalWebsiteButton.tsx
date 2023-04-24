import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Routes } from 'constants/routes'
import { MouseEventHandler } from 'react'

const externalWebsiteOptions = ['payment', 'tax', 'contact'] as const
export type ExternalWebsiteOption = typeof externalWebsiteOptions[number]

export type ExternalWebsiteProps = {
  option: ExternalWebsiteOption
}
export const ExternalWebsiteButton = ({ option }: ExternalWebsiteProps) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  const externalWebsiteButtonPropsMap: Record<
    ExternalWebsiteOption,
    { name: string; onClick: MouseEventHandler<HTMLButtonElement> }
  > = {
    payment: {
      name: t('update_payment_button'),
      onClick: () => router.push(Routes.UPDATE_PAYMENT_INFO),
    },
    tax: {
      name: t('tax_doc_button'),
      onClick: () => router.push(Routes.TAX_DOCUMENTS),
    },
    contact: {
      name: t('update_contact_info_button'),
      onClick: () => router.push(Routes.UPDATE_CONTACT_INFO),
    },
  }

  const { name, onClick } = externalWebsiteButtonPropsMap[`${option}`]

  return (
    <Button type="button" secondary onClick={onClick}>
      {name}
    </Button>
  )
}
