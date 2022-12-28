import { ComponentProps, ReactNode, useRef } from 'react'
import { FormGroup, ErrorMessage, Fieldset } from '@trussworks/react-uswds'
import { useField } from 'formik'

import CheckboxField from 'components/form/fields/CheckboxField/CheckboxField'
import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

import styles from './CheckboxGroupField.module.scss'

type OptionOmitProps = 'id' | 'name' | 'value' | 'label'

type CheckboxOption = {
  value: string
  label: ReactNode
  checkboxProps?: Omit<ComponentProps<typeof CheckboxField>, OptionOmitProps>
}

interface ICheckBoxGroupFieldProps {
  id?: string
  name: string
  legend?: ReactNode
  options: CheckboxOption[]
}

export const CheckboxGroupField = ({
  id,
  name,
  legend,
  options,
}: ICheckBoxGroupFieldProps) => {
  const [fieldProps, metaProps] = useField(name)
  const showError = useShowErrors(name)
  const checkboxRef = useRef<HTMLInputElement>(null)

  useFocusFirstError(metaProps.error, checkboxRef)

  return (
    <FormGroup error={showError}>
      <Fieldset
        legend={legend}
        className={`${styles.fieldsetLegend} ${
          showError && styles.errorLegend
        }`}
        onInvalid={(e) => e.preventDefault()}
      >
        {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
        {options.map((option, index) => (
          <CheckboxField
            {...fieldProps}
            key={`${id || name}.${index}.${option.value}`}
            id={`${id || name}.${option.value}`}
            name={name}
            formGroupClassName="margin-top-1"
            label={option.label}
            value={option.value}
            checked={!!fieldProps?.value?.includes(option.value)}
            {...option.checkboxProps}
            inputRef={index === 0 ? checkboxRef : undefined}
            showsErrors={false}
          />
        ))}
      </Fieldset>
    </FormGroup>
  )
}
