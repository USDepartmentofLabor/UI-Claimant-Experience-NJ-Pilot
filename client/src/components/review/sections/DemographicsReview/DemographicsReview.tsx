import { useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'

import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { DemographicsPageDefinition } from 'constants/pages/definitions/demographicsPageDefinition'

export const DemographicsReview = () => {
  const { t } = useTranslation('claimForm')
  const { claimFormValues } = useContext(ClaimFormContext)
  const { heading, path } = DemographicsPageDefinition

  return (
    <ReviewSection heading={heading} editUrl={path}>
      {claimFormValues?.sex && (
        <ReviewElement
          label={t(`sex.label`)}
          value={t(`sex.options.${claimFormValues?.sex}`)}
        />
      )}
      {claimFormValues?.ethnicity && (
        <ReviewElement
          label={t('ethnicity.label')}
          value={t(`ethnicity.options.${claimFormValues?.ethnicity}`)}
        />
      )}
      {claimFormValues?.race && (
        <ReviewElement
          label={t('race.label')}
          value={t(`race.options.${claimFormValues?.race}`)}
        />
      )}
      {claimFormValues?.education_level && (
        <ReviewElement
          label={t('education_level.label')}
          value={t(
            `education_level.options.${claimFormValues?.education_level}`
          )}
        />
      )}
    </ReviewSection>
  )
}
