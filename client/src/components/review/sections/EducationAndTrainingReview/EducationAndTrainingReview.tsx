import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { useTranslation } from 'next-i18next'
import { EducationAndTrainingPageDefinition } from 'constants/pages/definitions/educationAndTrainingPageDefinition'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'

export const EducationAndTrainingReview = () => {
  const { t } = useTranslation('claimForm')
  const { claimFormValues } = useContext(ClaimFormContext)
  const { heading, path } = EducationAndTrainingPageDefinition
  return (
    <ReviewSection heading={heading} editUrl={path}>
      <ReviewYesNo
        label={t('education_and_training.attending_training.label')}
        value={claimFormValues?.attending_college_or_job_training}
      />
      <ReviewYesNo
        label={t(
          'education_and_training.training_through_hiring_hall_or_career_center.label'
        )}
        value={claimFormValues?.training_through_hiring_hall_or_career_center}
      />
    </ReviewSection>
  )
}
