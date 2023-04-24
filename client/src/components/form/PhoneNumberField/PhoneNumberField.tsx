import TextField from '../fields/TextField/TextField'
import { useTranslation } from 'react-i18next'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { ChangeEventHandler, ReactNode } from 'react'

type PhoneNumberFieldProps = {
  id?: string
  name: string
  label: ReactNode
  showSMS?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const PhoneNumberField = ({
  id: idProp,
  name,
  label,
  showSMS = true,
  onChange,
}: PhoneNumberFieldProps) => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'contact',
  })

  const id = idProp || name

  return (
    <>
      <TextField
        id={`${id}.number`}
        name={`${name}.number`}
        label={label}
        type="tel"
        onChange={onChange}
        inputMode="numeric"
        placeholder="___-___-____"
        maxLength={12}
      />
      {showSMS && (
        <YesNoQuestion
          question={t('sms.label')}
          hint={t('sms.help_text')}
          name={`${name}.sms`}
        />
      )}
    </>
  )
}
