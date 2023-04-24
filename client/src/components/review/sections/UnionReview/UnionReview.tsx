import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { UnionPageDefinition } from 'constants/pages/definitions/unionPageDefinition'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'

export const UnionReview = () => {
  const { t } = useTranslation('claimForm')
  const { claimFormValues, hideEditUrl } = useContext(ClaimFormContext)
  const { heading, path } = UnionPageDefinition
  return (
    <ReviewSection heading={heading} editUrl={!hideEditUrl ? path : undefined}>
      <ReviewYesNo
        label={t('union.required_to_seek_work_through_hiring_hall.label')}
        value={claimFormValues?.required_to_seek_work_through_hiring_hall}
      />
      <ReviewElement
        label={t('union.union_name.label')}
        value={claimFormValues?.union_name}
      />
      <ReviewElement
        label={t('union.union_local_number.label')}
        value={claimFormValues?.union_local_number}
      />
    </ReviewSection>
  )
}
