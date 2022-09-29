import TextField from '../fields/TextField/TextField'
import { useTranslation } from 'react-i18next'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { ReactNode } from 'react'

type PhoneNumberFieldProps = {
  id?: string
  name: string
  label: ReactNode
  showSMS?: boolean
}

export const PhoneNumberField = ({
  id: idProp,
  name,
  label,
  showSMS = true,
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
