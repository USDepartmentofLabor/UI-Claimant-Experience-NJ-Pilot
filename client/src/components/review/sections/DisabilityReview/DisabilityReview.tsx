import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { DisabilityPageDefinition } from 'constants/pages/definitions/disabilityPageDefinition'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
import { DisabilityPaymentTypeOption } from 'constants/formOptions'
import { formatStoredDateToDisplayDate } from 'utils/date/format'

export const DisabilityReview = () => {
  const { t } = useTranslation('claimForm')
  const { claimFormValues, hideEditUrl } = useContext(ClaimFormContext)

  const { heading, path } = DisabilityPageDefinition
  const buildDisabililtyOptionText = (
    disabilityPaymentSelections: DisabilityPaymentTypeOption[] | undefined
  ) => {
    if (
      !disabilityPaymentSelections ||
      disabilityPaymentSelections.length === 0
    ) {
      return undefined
    }

    let displayText = ''
    for (const selection of disabilityPaymentSelections) {
      if (displayText !== '') {
        displayText = displayText.concat('\n')
      }

      displayText = displayText.concat(
        t(`disability.disability_applied_to_or_received.options.${selection}`)
      )
    }
    return displayText
  }
  return (
    <ReviewSection heading={heading} editUrl={!hideEditUrl ? path : undefined}>
      <ReviewElement
        label={t('disability.disability_applied_to_or_received.label')}
        value={buildDisabililtyOptionText(
          claimFormValues?.disability_applied_to_or_received
        )}
      />
      <ReviewYesNo
        label={t('disability.disabled_immediately_before.label')}
        value={claimFormValues?.disabled_immediately_before}
      />
      <ReviewElement
        label={t('disability.type_of_disability.label')}
        value={
          claimFormValues?.type_of_disability &&
          t(
            `disability.type_of_disability.options.${claimFormValues.type_of_disability}`
          )
        }
      />
      <ReviewElement
        label={t('disability.date_disability_began.label')}
        value={formatStoredDateToDisplayDate(
          claimFormValues?.date_disability_began
        )}
      />
      <ReviewElement
        label={t('disability.recovery_date.label')}
        value={formatStoredDateToDisplayDate(claimFormValues?.recovery_date)}
      />
      <ReviewYesNo
        label={t('disability.contacted_last_employer_after_recovery.label')}
        value={claimFormValues?.contacted_last_employer_after_recovery}
      />
    </ReviewSection>
  )
}
