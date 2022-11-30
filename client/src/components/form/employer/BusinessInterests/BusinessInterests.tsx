import { Fieldset } from '@trussworks/react-uswds'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'
import { useClearFields } from 'hooks/useClearFields'
import { ClaimantInput } from 'types/claimantInput'
import { ChangeEventHandler } from 'react'
import { employerRelationOptions } from 'constants/formOptions'

interface BusinessInterestsProps {
  index: string
}

export const BusinessInterests = ({ index }: BusinessInterestsProps) => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'employers.business_interests',
  })
  const { values } = useFormikContext<ClaimantInput>()
  const { clearField } = useClearFields()

  const handleCorporateOfficerOrStockOwnershipChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value === 'yes') {
      clearField(`employers[${index}].employer_is_sole_proprietorship`)
      clearField(
        `employers[${index}].related_to_owner_or_child_of_owner_under_18`
      )
    }
  }
  const handleSoleProprietorshipChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.target.value === 'yes') {
      clearField(
        `employers[${index}].related_to_owner_or_child_of_owner_under_18`
      )
    }
  }

  const showSoleProprietorship =
    values.employers?.[parseInt(index)].corporate_officer_or_stock_ownership ===
    false
  const showRelatedToOwner =
    showSoleProprietorship &&
    values.employers?.[parseInt(index)].employer_is_sole_proprietorship ===
      false

  const baseName = `employers[${index}]`
  return (
    <>
      <h2 className="font-heading-sm">{t('section_title')}</h2>
      <YesNoQuestion
        name={`${baseName}.self_employed`}
        question={t('self_employed.label')}
      />
      <YesNoQuestion
        name={`${baseName}.is_owner`}
        question={t('is_owner.label')}
      />
      <YesNoQuestion
        name={`${baseName}.corporate_officer_or_stock_ownership`}
        question={t('corporate_officer_or_stock_ownership.label')}
        onChange={handleCorporateOfficerOrStockOwnershipChange}
      />
      {showSoleProprietorship && (
        <YesNoQuestion
          name={`${baseName}.employer_is_sole_proprietorship`}
          question={t('employer_is_sole_proprietorship.label')}
          hint={t('employer_is_sole_proprietorship.hint')}
          onChange={handleSoleProprietorshipChange}
        />
      )}
      {showRelatedToOwner && (
        <Fieldset
          legend={t('related_to_owner_or_child_of_owner_under_18.label')}
        >
          <RadioField
            name={`${baseName}.related_to_owner_or_child_of_owner_under_18`}
            options={employerRelationOptions.map((option) => ({
              label: t(
                `related_to_owner_or_child_of_owner_under_18.options.${option}.label`
              ),
              value: option,
            }))}
          />
        </Fieldset>
      )}
    </>
  )
}
