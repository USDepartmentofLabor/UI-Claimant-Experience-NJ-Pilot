import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { OccupationPageDefinition } from 'constants/pages/definitions/occupationPageDefinition'

export const OccupationReview = () => {
  const { t } = useTranslation('claimForm')
  const { claimFormValues, hideEditUrl } = useContext(ClaimFormContext)
  const { heading, path } = OccupationPageDefinition
  return (
    <ReviewSection heading={heading} editUrl={!hideEditUrl ? path : undefined}>
      <ReviewElement
        label={t('occupation.job_title.label')}
        value={claimFormValues?.job_title}
      />
      <ReviewElement
        label={t('occupation.job_description.label')}
        value={claimFormValues?.job_description}
      />
    </ReviewSection>
  )
}
