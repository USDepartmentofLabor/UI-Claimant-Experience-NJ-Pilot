import { useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { IdentityPageDefinition } from 'constants/pages/definitions/identityPageDefinition'
import { formatStoredDateToDisplayDate } from 'utils/date/format'

export const IdentityReview = () => {
  const { t } = useTranslation('claimForm')
  const { t: tSsn } = useTranslation('ssn')
  const { claimFormValues, maskSensitiveData, hideEditUrl } =
    useContext(ClaimFormContext)
  const maskSSN = maskSensitiveData === undefined ? true : maskSensitiveData
  const { heading, path } = IdentityPageDefinition

  return (
    <ReviewSection heading={heading} editUrl={!hideEditUrl ? path : undefined}>
      <ReviewElement
        label={tSsn('label')}
        value={claimFormValues?.ssn}
        maskable={maskSSN}
      />
      <ReviewElement
        label={t('birthdate.label')}
        value={formatStoredDateToDisplayDate(claimFormValues?.birthdate)}
      />
      <ReviewYesNo
        label={t('has_nj_issued_id.label')}
        value={claimFormValues?.has_nj_issued_id}
      />
      <ReviewElement
        label={t('drivers_license_or_state_id_number.label')}
        value={claimFormValues?.drivers_license_or_state_id_number}
      />
      {claimFormValues?.authorization_type && (
        <ReviewElement
          label={t('work_authorization.authorization_type.label')}
          value={t(
            `work_authorization.authorization_type.options.${claimFormValues?.authorization_type}`
          )}
        />
      )}

      <ReviewElement
        label={t('name.first_name.label')}
        value={
          claimFormValues?.employment_authorization_document_name?.first_name
        }
      />
      <ReviewElement
        label={t('name.middle_initial.label')}
        value={
          claimFormValues?.employment_authorization_document_name
            ?.middle_initial
        }
      />
      <ReviewElement
        label={t('name.last_name.label')}
        value={
          claimFormValues?.employment_authorization_document_name?.last_name
        }
      />
      <ReviewElement
        label={t('name.suffix.label')}
        value={claimFormValues?.employment_authorization_document_name?.suffix}
      />
      <ReviewElement
        label={t('work_authorization.alien_registration_number.label')}
        value={claimFormValues?.alien_registration_number}
      />
      <ReviewElement
        label={t('work_authorization.country_of_origin.label')}
        value={claimFormValues?.country_of_origin}
      />
      <ReviewElement
        label={t(
          'work_authorization.employment_authorization_start_date.label'
        )}
        value={formatStoredDateToDisplayDate(
          claimFormValues?.employment_authorization_start_date
        )}
      />
      <ReviewElement
        label={t('work_authorization.employment_authorization_end_date.label')}
        value={formatStoredDateToDisplayDate(
          claimFormValues?.employment_authorization_end_date
        )}
      />
    </ReviewSection>
  )
}
