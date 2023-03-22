import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ContactPageDefinition } from 'constants/pages/definitions/contactPageDefinition'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
import { formatStoredToDisplayPhone } from 'utils/phone/format'

export const ContactReview = () => {
  const { t } = useTranslation('claimForm')

  const { claimFormValues, hideEditUrl } = useContext(ClaimFormContext)

  const { heading, path } = ContactPageDefinition

  return (
    <ReviewSection heading={heading} editUrl={!hideEditUrl ? path : undefined}>
      <ReviewElement
        label={t('contact.claimant_phone.label')}
        value={formatStoredToDisplayPhone(
          claimFormValues?.claimant_phone?.number
        )}
      />
      <ReviewYesNo
        label={t('contact.sms.label')}
        value={claimFormValues?.claimant_phone?.sms}
      />
      <ReviewElement
        label={t('contact.alternate_phone.label')}
        value={
          claimFormValues?.alternate_phone?.number &&
          formatStoredToDisplayPhone(claimFormValues?.alternate_phone?.number)
        }
      />
      <ReviewElement
        label={t('contact.email.label')}
        value={claimFormValues?.email}
      />
      <ReviewElement
        label={t('contact.interpreter_required.label')}
        value={
          claimFormValues?.interpreter_required &&
          t(
            `contact.interpreter_required.options.${claimFormValues.interpreter_required}`
          )
        }
      />
      <ReviewElement
        label={t('contact.preferred_language.label')}
        value={
          claimFormValues?.preferred_language &&
          t(
            `contact.preferred_language.options.${claimFormValues.preferred_language}`
          )
        }
      />
      <ReviewElement
        label={t('contact.other_language')}
        value={claimFormValues?.preferred_language_other}
      />
    </ReviewSection>
  )
}
