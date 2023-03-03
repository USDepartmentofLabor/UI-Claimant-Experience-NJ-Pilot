import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'

export const ScreenerReview = () => {
  const { t } = useTranslation('screener')
  const { claimFormValues } = useContext(ClaimFormContext)

  return (
    <ReviewSection heading={t('heading')}>
      <ReviewYesNo
        label={t('screener_current_country_us.label')}
        value={claimFormValues?.screener_current_country_us}
      />
      <ReviewYesNo
        label={t('screener_live_in_canada.label')}
        value={claimFormValues?.screener_live_in_canada}
      />
      <ReviewYesNo
        label={t('screener_job_last_eighteen_months.label')}
        value={claimFormValues?.screener_job_last_eighteen_months}
      />
      <ReviewYesNo
        label={t('screener_military_service_eighteen_months.label')}
        value={claimFormValues?.screener_military_service_eighteen_months}
      />
      <ReviewElement
        label={t('screener_work_nj.label')}
        value={
          claimFormValues?.screener_work_nj &&
          t(`screener_work_nj.options.${claimFormValues?.screener_work_nj}`)
        }
      />
      <ReviewYesNo
        label={t('screener_currently_disabled.label')}
        value={claimFormValues?.screener_currently_disabled}
      />
      <ReviewYesNo
        label={t('screener_federal_work_in_last_eighteen_months.label')}
        value={claimFormValues?.screener_federal_work_in_last_eighteen_months}
      />
      <ReviewYesNo
        label={t('screener_maritime_employer_eighteen_months.label')}
        value={claimFormValues?.screener_maritime_employer_eighteen_months}
      />
    </ReviewSection>
  )
}
