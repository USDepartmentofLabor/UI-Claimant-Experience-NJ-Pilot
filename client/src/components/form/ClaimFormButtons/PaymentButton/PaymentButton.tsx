import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Routes } from 'constants/routes'

export const PaymentButton = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const goToUpdatePaymentForm = () => router.push(Routes.UPDATE_PAYMENT_INFO)

  return (
    <>
      {' '}
      <Button
        type="button"
        secondary
        onClick={goToUpdatePaymentForm}
        data-testid="go-to-update-payment"
      >
        {t('update_payment_button')}
      </Button>
    </>
  )
}
