import { useTranslation } from 'react-i18next'
import TextField from '../../fields/TextField/TextField'
import { Fieldset, FormGroup } from '@trussworks/react-uswds'
import { StatesDropdown } from '../../StatesDropdown/StatesDropdown'
import { YesNoQuestion } from '../../YesNoQuestion/YesNoQuestion'
import { PhoneNumberField } from '../../PhoneNumberField/PhoneNumberField'
import { Employer } from 'types/claimantInput'
import { useFormikContext } from 'formik'
import { useClearFields } from 'hooks/useClearFields'
import { ChangeEventHandler } from 'react'
import { Trans } from 'react-i18next'
import { parseCityAndStateFromImportedAddress } from 'utils/employer/employerUtils'
import { formatStoredToDisplayPhone } from 'utils/phone/format'
import { EMPLOYER_SKELETON } from 'components/form/EditEmployer/EditEmployer'

export const WorkLocation = () => {
  const { values } = useFormikContext<Employer>()
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'employers.work_location',
  })
  const { clearField } = useClearFields()
  const handleEmployerWorkLocationChange: ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.value === 'yes') {
      await clearField(
        `alternate_physical_work_address.city`,
        EMPLOYER_SKELETON.alternate_physical_work_address.city
      )
      await clearField(
        `alternate_physical_work_address.state`,
        EMPLOYER_SKELETON.alternate_physical_work_address.state
      )
      await clearField(
        `alternate_physical_work_address.zipcode`,
        EMPLOYER_SKELETON.alternate_physical_work_address.zipcode
      )
    }
  }
  const handleEmployerLocationPhoneChange: ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.value === 'yes') {
      await clearField(
        `work_location_phone`,
        EMPLOYER_SKELETON.work_location_phone
      )
    }
  }

  const employerCityAndState =
    values.is_imported && values.imported_address
      ? parseCityAndStateFromImportedAddress(values.imported_address)
      : {
          city: values?.employer_address?.city,
          state: values.employer_address?.state,
        }

  return (
    <>
      <Fieldset className="form-section" legend={<h2>{t('section_title')}</h2>}>
        <YesNoQuestion
          question={
            employerCityAndState.city && employerCityAndState.state ? (
              <Trans t={t} i18nKey="worked_at_employer_address.label">
                {employerCityAndState.city}
                {employerCityAndState.state}
              </Trans>
            ) : (
              t('worked_at_employer_address.placeholder')
            )
          }
          name={`worked_at_employer_address`}
          onChange={handleEmployerWorkLocationChange}
        />
        {values.worked_at_employer_address === false && (
          <FormGroup>
            <TextField
              name={`alternate_physical_work_address.city`}
              label={t('alternate_physical_work_address.city.label')}
              type="text"
              data-testid={`city`}
            />
            <StatesDropdown
              name={`alternate_physical_work_address.state`}
              label={t('alternate_physical_work_address.state.label')}
              data-testid={`state`}
              startEmpty
            />
            <TextField
              name={`alternate_physical_work_address.zipcode`}
              label={t('alternate_physical_work_address.zipcode.label')}
              type="text"
              inputMode="numeric"
              data-testid={`zipcode`}
            />
          </FormGroup>
        )}

        {values.employer_phone?.number !== '' && (
          <YesNoQuestion
            question={
              <Trans t={t} i18nKey="is_employer_phone_accurate.label">
                {formatStoredToDisplayPhone(values.employer_phone?.number)}
              </Trans>
            }
            name={`is_employer_phone_accurate`}
            onChange={handleEmployerLocationPhoneChange}
          />
        )}
        {values.is_employer_phone_accurate === false && (
          <PhoneNumberField
            name={`work_location_phone`}
            label={t('work_location_phone.label')}
            showSMS={false}
          />
        )}
      </Fieldset>
    </>
  )
}
