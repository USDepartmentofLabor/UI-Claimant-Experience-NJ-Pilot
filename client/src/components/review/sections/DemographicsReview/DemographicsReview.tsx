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
      <ReviewElement
        label={t(`sex.label`)}
        value={claimFormValues?.sex && t(`sex.options.${claimFormValues?.sex}`)}
      />
      <ReviewElement
        label={t('ethnicity.label')}
        value={
          claimFormValues?.ethnicity &&
          t(`ethnicity.options.${claimFormValues?.ethnicity}`)
        }
      />
      <ReviewElement
        label={t('race.label')}
        value={
          claimFormValues?.race && t(`race.options.${claimFormValues?.race[0]}`)
        }
      />
      <ReviewElement
        label={t('education_level.label')}
        value={
          claimFormValues?.education_level &&
          t(`education_level.options.${claimFormValues?.education_level}`)
        }
      />
    </ReviewSection>
  )
}
