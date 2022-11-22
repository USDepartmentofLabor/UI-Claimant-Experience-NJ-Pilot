import { useTranslation } from 'react-i18next'
import TextField from 'components/form//fields/TextField/TextField'
import { Fieldset, FormGroup } from '@trussworks/react-uswds'
import { StatesDropdown } from 'components/form/StatesDropdown/StatesDropdown'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { PhoneNumberField } from 'components/form/PhoneNumberField/PhoneNumberField'
import { ClaimantInput } from 'types/claimantInput'
import { useFormikContext } from 'formik'
import { useClearFields } from 'hooks/useClearFields'
import { ChangeEventHandler } from 'react'
import { Trans } from 'react-i18next'

interface IWorkLocationProps {
  index: string
}

export const WorkLocation = ({ index }: IWorkLocationProps) => {
  const { values } = useFormikContext<ClaimantInput>()
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'employers.work_location',
  })
  const { clearField } = useClearFields()
  const baseName = `employers[${index}]`
  const handleEmployerWorkLocationChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value === 'yes') {
      clearField(`${baseName}.alternate_physical_work_address.city`)
      clearField(`${baseName}.alternate_physical_work_address.state`)
      clearField(`${baseName}.alternate_physical_work_address.zipcode`)
    }
  }
  const handleEmployerLocationPhoneChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value === 'yes') {
      clearField(`${baseName}.work_location_phone`)
    }
  }

  return (
    <>
      <Fieldset legend={<b>{t('section_title')} </b>}>
        <YesNoQuestion
          question={
            <Trans t={t} i18nKey="worked_at_employer_address.label">
              {
                JSON.parse(
                  JSON.stringify(
                    values.employers?.[parseInt(index)].employer_address
                  )
                ).city
              }
              {
                JSON.parse(
                  JSON.stringify(
                    values.employers?.[parseInt(index)].employer_address
                  )
                ).state
              }
            </Trans>
          }
          name={`${baseName}.worked_at_employer_address`}
          onChange={handleEmployerWorkLocationChange}
        />
        {values.employers?.[parseInt(index)].worked_at_employer_address ===
          false && (
          <FormGroup>
            <TextField
              name={`${baseName}.alternate_physical_work_address.city`}
              label={t('alternate_physical_work_address.city.label')}
              type="text"
              data-testid={`${baseName}.city`}
            />
            <StatesDropdown
              name={`${baseName}.alternate_physical_work_address.state`}
              label={t('alternate_physical_work_address.state.label')}
              data-testid={`${baseName}.state`}
              startEmpty
            />
            <TextField
              name={`${baseName}.alternate_physical_work_address.zipcode`}
              label={t('alternate_physical_work_address.zipcode.label')}
              type="text"
              inputMode="numeric"
              data-testid={`${baseName}.zipcode`}
            />
          </FormGroup>
        )}

        <YesNoQuestion
          question={
            <Trans t={t} i18nKey="is_employer_phone_accurate.label">
              {values.employers?.[parseInt(index)].employer_phone}
            </Trans>
          }
          name={`${baseName}.is_employer_phone_accurate`}
          onChange={handleEmployerLocationPhoneChange}
        />
        {values.employers?.[parseInt(index)].is_employer_phone_accurate ===
          false && (
          <PhoneNumberField
            name={`${baseName}.work_location_phone`}
            label={t('work_location_phone.label')}
            showSMS={false}
          />
        )}
      </Fieldset>
    </>
  )
}
