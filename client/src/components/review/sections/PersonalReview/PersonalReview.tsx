import { Fragment, useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { PersonalPageDefinition } from 'constants/pages/definitions/personalPageDefinition'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
import { buildPersonalAddress } from 'utils/address/format'

export const PersonalReview = () => {
  const { t } = useTranslation('claimForm')
  const { t: tContact } = useTranslation('contact')

  const { claimFormValues } = useContext(ClaimFormContext)

  const { heading, path } = PersonalPageDefinition

  return (
    <ReviewSection heading={heading} editUrl={path}>
      <ReviewElement
        label={t('name.first_name.label')}
        value={claimFormValues?.claimant_name?.first_name}
      />
      <ReviewElement
        label={t('name.middle_initial.label')}
        value={claimFormValues?.claimant_name?.middle_initial}
      />
      <ReviewElement
        label={t('name.last_name.label')}
        value={claimFormValues?.claimant_name?.last_name}
      />
      <ReviewElement
        label={t('name.suffix.label')}
        value={claimFormValues?.claimant_name?.suffix}
      />

      <ReviewYesNo
        label={t('name.claimant_has_alternate_names.label')}
        value={claimFormValues?.LOCAL_claimant_has_alternate_names}
      />

      {claimFormValues?.alternate_names?.map((alternateName, index) => (
        <Fragment key={`alternate_names[${index}]`}>
          <ReviewElement
            label={t('name.first_name.label')}
            value={alternateName.first_name}
          />
          <ReviewElement
            label={t('name.middle_initial.label')}
            value={alternateName.middle_initial}
          />
          <ReviewElement
            label={t('name.last_name.label')}
            value={alternateName.last_name}
          />
          <ReviewElement
            label={t('name.suffix.label')}
            value={alternateName.suffix}
          />
        </Fragment>
      ))}

      <ReviewElement
        label={t('personal.residence_address.label')}
        value={buildPersonalAddress(claimFormValues?.residence_address)}
      />

      <ReviewYesNo
        label={tContact('label.mailing_address_same')}
        value={claimFormValues?.LOCAL_mailing_address_same}
      />

      {claimFormValues?.LOCAL_mailing_address_same || (
        <ReviewElement
          label={t('personal.mailing_address.label')}
          value={buildPersonalAddress(claimFormValues?.mailing_address)}
        />
      )}
    </ReviewSection>
  )
}
