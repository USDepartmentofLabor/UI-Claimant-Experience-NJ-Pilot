import {
  TextInput,
  FormGroup,
  Label,
  ErrorMessage,
} from '@trussworks/react-uswds'
import { useField } from 'formik'
import { useFocusFirstError } from 'hooks/useFocusFirstError'
import { useShowErrors } from 'hooks/useShowErrors'
import { ReactNode, useState, useRef, ChangeEvent } from 'react'

type TextInputProps = Optional<React.ComponentProps<typeof TextInput>, 'id'>

interface IAlienRegistrationNumberProps extends TextInputProps {
  label: ReactNode
  hint?: ReactNode
}

export const AlienRegistrationNumberField = ({
  label,
  hint,
  onChange,
  ...textInputProps
}: IAlienRegistrationNumberProps) => {
  const [fieldProps, metaProps, fieldHelperProps] = useField<
    string | undefined
  >(textInputProps.name)

  const [focused, setFocused] = useState(false)
  const showError = useShowErrors(textInputProps.name)
  const showErrorOutline = showError && !focused
  const textFieldRef = useRef<HTMLInputElement>(null)
  const [displayVal, setDisplayVal] = useState<string>(metaProps.value || '')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayVal(e.target.value)
    if (onChange) {
      onChange(e)
    }
    updateFormik(e.target.value)
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    setFocused(false)
    fieldProps.onBlur(e)
  }

  // Only pad value if it's 7 or 8 character length
  const updateFormik = (value: string) => {
    if (value.length > 6 && value.length < 9) {
      const paddedValue = value.padStart(9, '0')
      fieldHelperProps.setValue(paddedValue)
    } else {
      fieldHelperProps.setValue(value)
    }
  }

  useFocusFirstError(metaProps.error, textFieldRef)

  return (
    <FormGroup error={showError}>
      <Label
        error={showError}
        htmlFor={textInputProps.id || textInputProps.name}
      >
        {label}
      </Label>
      <div className="usa-hint" id={`${textInputProps.name}-hint`}>
        {hint}
      </div>
      {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
      <TextInput
        {...fieldProps}
        data-testid={textInputProps.id}
        value={displayVal}
        validationStatus={showErrorOutline ? 'error' : undefined}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        id={textInputProps.id || textInputProps.name}
        onChange={handleChange}
        {...textInputProps}
        inputRef={textFieldRef}
        onInvalid={(e) => e.preventDefault()}
      />
    </FormGroup>
  )
}
