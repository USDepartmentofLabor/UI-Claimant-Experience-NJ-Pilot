import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Routes } from 'constants/routes'

const externalWebsiteOptions = ['payment', 'tax', 'contact']
export type ExternalWebsiteOption = typeof externalWebsiteOptions[number]

export type ExternalWebsiteProps = {
  option: ExternalWebsiteOption
}
export const ExternalWebsiteButton = ({ option }: ExternalWebsiteProps) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  const goToUpdatePaymentForm = () => router.push(Routes.UPDATE_PAYMENT_INFO)
  const goToUpdateContactInfoForm = () =>
    router.push(Routes.UPDATE_CONTACT_INFO)
  const goToTaxDocumentsPage = () => router.push(Routes.TAX_DOCUMENTS)

  let name = t('update_payment_button')
  let gotToExternalSite = goToUpdatePaymentForm

  if (option !== 'payment') {
    name =
      option === 'tax' ? t('tax_doc_button') : t('update_contact_info_button')
    gotToExternalSite =
      option === 'tax' ? goToTaxDocumentsPage : goToUpdateContactInfoForm
  }

  return (
    <>
      <Button type="button" secondary onClick={gotToExternalSite}>
        {name}
      </Button>
    </>
  )
}
