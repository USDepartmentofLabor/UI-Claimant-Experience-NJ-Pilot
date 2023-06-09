import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { useTranslation, Trans } from 'react-i18next'
import { useFormikContext } from 'formik'
import { useClearFields } from 'hooks/useClearFields'
import { Employer } from 'types/claimantInput'
import { ChangeEventHandler } from 'react'
import { Fieldset } from '@trussworks/react-uswds'
import { solePropOptions, employerRelationOptions } from 'constants/formOptions'
import { EMPLOYER_SKELETON } from 'components/form/EditEmployer/EditEmployer'

export const BusinessInterests = () => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'employers.business_interests',
  })
  const { values } = useFormikContext<Employer>()
  const { clearField } = useClearFields()

  const handleCorporateOfficerOrStockOwnershipChange: ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.value === 'yes') {
      await clearField(
        `employer_is_sole_proprietorship`,
        EMPLOYER_SKELETON.employer_is_sole_proprietorship
      )
      await clearField(
        `related_to_owner_or_child_of_owner_under_18`,
        EMPLOYER_SKELETON.employer_is_sole_proprietorship
      )
    }
  }
  const handleSoleProprietorshipChange: ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.value === 'yes') {
      await clearField(
        `related_to_owner_or_child_of_owner_under_18`,
        EMPLOYER_SKELETON.related_to_owner_or_child_of_owner_under_18
      )
    }
  }

  const showSoleProprietorship =
    values.corporate_officer_or_stock_ownership === false
  const showRelatedToOwner =
    (showSoleProprietorship &&
      values.employer_is_sole_proprietorship === 'yes') ||
    values.employer_is_sole_proprietorship === 'not_sure'

  return (
    <Fieldset className="form-section" legend={<h2>{t('section_title')}</h2>}>
      <YesNoQuestion
        name={`self_employed`}
        question={t('self_employed.label')}
      />
      <YesNoQuestion name={`is_owner`} question={t('is_owner.label')} />
      <YesNoQuestion
        name={`corporate_officer_or_stock_ownership`}
        question={t('corporate_officer_or_stock_ownership.label')}
        onChange={handleCorporateOfficerOrStockOwnershipChange}
      />
      {showSoleProprietorship && (
        <RadioField
          name={`employer_is_sole_proprietorship`}
          legend={t('employer_is_sole_proprietorship.label')}
          hint={<Trans t={t} i18nKey="employer_is_sole_proprietorship.hint" />}
          options={solePropOptions.map((option) => ({
            label: t(`employer_is_sole_proprietorship.options.${option}`),
            value: option,
          }))}
          onChange={handleSoleProprietorshipChange}
        />
      )}
      {showRelatedToOwner && (
        <RadioField
          name={`related_to_owner_or_child_of_owner_under_18`}
          legend={t('related_to_owner_or_child_of_owner_under_18.label')}
          options={employerRelationOptions.map((option) => ({
            label: t(
              `related_to_owner_or_child_of_owner_under_18.options.${option}.label`
            ),
            value: option,
          }))}
        />
      )}
    </Fieldset>
  )
}
