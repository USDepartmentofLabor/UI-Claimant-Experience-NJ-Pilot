import { useField } from 'formik'
import { Radio, FormGroup, ErrorMessage } from '@trussworks/react-uswds'
import { ChangeEvent, ComponentProps, ReactNode, useRef } from 'react'

import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

interface IRadioOption {
  label: ReactNode
  value: string
}

type RadioInputProps = Optional<
  Omit<ComponentProps<typeof Radio>, 'label' | 'value'>,
  'id'
>

interface IRadioFieldProps extends RadioInputProps {
  options: IRadioOption[]
  errorMessage?: string
}

export const RadioField = ({
  id: idProp,
  options,
  onChange,
  errorMessage,
  ...inputProps
}: IRadioFieldProps & JSX.IntrinsicElements['input']) => {
  const [fieldProps, metaProps] = useField(inputProps.name)
  const showError = useShowErrors(inputProps.name)
  const radioRef = useRef<HTMLInputElement>(null)

  useFocusFirstError(metaProps.error, radioRef)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    fieldProps.onChange(e)
    if (onChange) {
      onChange(e)
    }
  }

  const id = idProp || inputProps.name

  return (
    <FormGroup error={showError}>
      {options.map((option, index) => (
        <Radio
          {...fieldProps}
          key={`${id}.${index}.${option.value}`}
          id={`${id}.${option.value}`}
          data-testid={`${id}.${option.value}`}
          label={option.label}
          value={option.value}
          checked={metaProps.value === option.value}
          onChange={handleChange}
          {...inputProps}
          inputRef={index === 0 ? radioRef : undefined}
        />
      ))}

      {showError && (
        <ErrorMessage>{errorMessage || metaProps.error}</ErrorMessage>
      )}
    </FormGroup>
  )
}
