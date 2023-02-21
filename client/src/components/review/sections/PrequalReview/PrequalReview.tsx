import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { PrequalPageDefinition } from 'constants/pages/definitions/prequalPageDefinition'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
import { getStatesTerritoriesProvincesNameFromAbbrev } from 'utils/review/reviewUtils'

export const PrequalReview = () => {
  const { t } = useTranslation('claimForm')

  const { claimFormValues } = useContext(ClaimFormContext)

  const { heading, path } = PrequalPageDefinition

  return (
    <ReviewSection heading={heading} editUrl={path}>
      <ReviewYesNo
        label={t('prequal.filed_in_last_12mo.label')}
        value={claimFormValues?.filed_in_last_12mo}
      />
      <ReviewElement
        label={t('prequal.state_province_territory_where_filed.label')}
        value={
          claimFormValues?.state_province_territory_where_filed &&
          getStatesTerritoriesProvincesNameFromAbbrev(
            claimFormValues?.state_province_territory_where_filed
          )
        }
      />
      <ReviewYesNo
        label={t('prequal.lived_outside_nj_when_working_nj.label')}
        value={claimFormValues?.lived_outside_nj_when_working_nj}
      />
      <ReviewYesNo
        label={t('prequal.will_look_for_work_in_nj.label')}
        value={claimFormValues?.will_look_for_work_in_nj}
      />
      <ReviewYesNo
        label={t('prequal.can_begin_work_immediately.label')}
        value={claimFormValues?.can_begin_work_immediately}
      />
    </ReviewSection>
  )
}
