import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Routes } from 'constants/routes'

export const TaxDocumentsButton = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const goToTaxDocumentsPage = () => router.push(Routes.TAX_DOCUMENTS)
  return (
    <>
      <Button
        type="button"
        secondary
        onClick={goToTaxDocumentsPage}
        data-testid="go-to-tax-documents"
      >
        {t('tax_doc_button')}
      </Button>
    </>
  )
}
