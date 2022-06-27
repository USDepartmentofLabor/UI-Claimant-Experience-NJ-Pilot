import TextField from '../fields/TextField/TextField'
import { Trans, useTranslation } from 'react-i18next'
import DropdownField from '../fields/DropdownField/DropdownField'
import CheckboxField from '../fields/CheckboxField/CheckboxField'
import { typeOfPhoneOptions } from 'constants/formOptions'

type PhoneNumberFieldProps = {
  id?: string
  name: string
  showSMS?: boolean
}

export const PhoneNumberField = ({
  id: idProp,
  name,
  showSMS = true,
}: PhoneNumberFieldProps) => {
  const { t } = useTranslation('common')

  const id = idProp || name

  return (
    <>
      <TextField
        id={`${id}.number`}
        name={`${name}.number`}
        label={t('phone.number.label')}
        type="tel"
      />
      <DropdownField
        id={`${id}.type`}
        name={`${name}.type`}
        label={
          <Trans t={t} i18nKey="phone.type.label">
            Type of phone number <i>(optional)</i>
          </Trans>
        }
        startEmpty
        options={typeOfPhoneOptions.map((option) => ({
          value: option,
          label: t(`phone.type.${option}`),
        }))}
      />
      {showSMS && (
        <CheckboxField
          id={`${id}.sms`}
          name={`${name}.sms`}
          label={t('phone.sms.label')}
        />
      )}
    </>
  )
}
