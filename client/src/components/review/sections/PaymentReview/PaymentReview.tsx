import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
import { PaymentPageDefinition } from 'constants/pages/definitions/paymentPageDefinition'

export const PaymentReview = () => {
  const { t } = useTranslation('claimForm')
  const { claimFormValues } = useContext(ClaimFormContext)
  const { heading, path } = PaymentPageDefinition

  return (
    <ReviewSection heading={heading} editUrl={path}>
      <ReviewElement
        label={t('payment.payment_method.label')}
        value={
          claimFormValues?.payment_method
            ? t(
                `payment.payment_method.options.${claimFormValues?.payment_method}`
              )
            : null
        }
      />
      <ReviewElement
        label={t('payment.account_type.label')}
        value={
          claimFormValues?.account_type
            ? t(`payment.account_type.options.${claimFormValues?.account_type}`)
            : null
        }
      />
      <ReviewElement
        label={t('payment.routing_number.label')}
        value={claimFormValues?.routing_number}
        maskable
      />
      <ReviewElement
        label={t('payment.account_number.label')}
        value={claimFormValues?.account_number}
        maskable
      />

      <ReviewYesNo
        label={t(
          'payment.payment_method.acknowledge_direct_deposit_option.label'
        )}
        value={
          claimFormValues?.acknowledge_direct_deposit_option &&
          claimFormValues?.acknowledge_direct_deposit_option
        }
      />

      <ReviewYesNo
        label={t('payment.federal_income_tax_withheld.label')}
        value={claimFormValues?.federal_income_tax_withheld}
      />
      <ReviewYesNo
        label={t('payment.apply_for_increased_payment_for_dependents.label')}
        value={claimFormValues?.apply_for_increased_payment_for_dependents}
      />
    </ReviewSection>
  )
}
