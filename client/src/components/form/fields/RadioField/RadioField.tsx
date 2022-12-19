import { useField } from 'formik'
import {
  Radio,
  FormGroup,
  ErrorMessage,
  Fieldset,
} from '@trussworks/react-uswds'
import { ChangeEvent, ComponentProps, ReactNode, useRef } from 'react'

import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

import styles from './RadioField.module.scss'

interface IRadioOption {
  label: ReactNode
  value: string
  labelDescription?: string
}

type RadioInputProps = Optional<
  Omit<ComponentProps<typeof Radio>, 'label' | 'value'>,
  'id'
>

interface IRadioFieldProps extends RadioInputProps {
  options: IRadioOption[]
  errorMessage?: string
  showsErrors?: boolean
  legend?: ReactNode
  fieldsetClassName?: string
}

export const RadioField = ({
  id: idProp,
  options,
  onChange,
  legend,
  fieldsetClassName,
  errorMessage,
  showsErrors = true,
  ...inputProps
}: IRadioFieldProps & JSX.IntrinsicElements['input']) => {
  const [fieldProps, metaProps] = useField(inputProps.name)
  const showError = showsErrors && useShowErrors(inputProps.name)
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
      <Fieldset
        legend={legend}
        className={`${fieldsetClassName} ${styles.fieldsetLegend} ${
          showError && styles.errorLegend
        }`}
        onInvalid={(e) => e.preventDefault()}
      >
        {showError && (
          <ErrorMessage>{errorMessage || metaProps.error}</ErrorMessage>
        )}
        {options.map((option, index) => (
          <Radio
            {...fieldProps}
            key={`${id}.${index}.${option.value}`}
            id={`${id}.${option.value}`}
            data-testid={`${id}.${option.value}`}
            label={option.label}
            labelDescription={option?.labelDescription}
            value={option.value}
            checked={metaProps.value === option.value}
            onChange={handleChange}
            {...inputProps}
            inputRef={index === 0 ? radioRef : undefined}
          />
        ))}
      </Fieldset>
    </FormGroup>
  )
}
