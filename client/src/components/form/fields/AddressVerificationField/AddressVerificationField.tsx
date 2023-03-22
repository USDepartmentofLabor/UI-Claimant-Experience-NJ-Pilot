import { useField } from 'formik'
import {
  Radio,
  FormGroup,
  ErrorMessage,
  Fieldset,
} from '@trussworks/react-uswds'

import { AddressInput } from 'types/claimantInput'
import { ChangeEvent, ComponentProps, ReactNode, useRef } from 'react'

import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

import styles from './AddressVerificationField.module.scss'

interface IAddressOption {
  label: ReactNode
  value: string
  address: AddressInput
}

type RadioInputProps = Optional<
  Omit<ComponentProps<typeof Radio>, 'label' | 'value'>,
  'id'
>

interface IAddressVerificationFieldProps extends RadioInputProps {
  options: IAddressOption[]
  errorMessage?: string
  showsErrors?: boolean
  legend?: ReactNode
  fieldsetClassName?: string
  hint?: ReactNode
}

export const AddressVerificationField = ({
  id: idProp,
  options,
  onChange,
  legend,
  fieldsetClassName,
  errorMessage,
  showsErrors = true,
  hint,
  ...inputProps
}: IAddressVerificationFieldProps & JSX.IntrinsicElements['input']) => {
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
        {hint && (
          <span className="usa-hint" id={`${inputProps.name}.hint`}>
            {hint}
          </span>
        )}
        {showError && (
          <ErrorMessage>{errorMessage || metaProps.error}</ErrorMessage>
        )}
        {options.map((option, index) => {
          const label = (
            <div className={`address-verification-label`}>
              <div
                className={`address-verification-description margin-bottom-1`}
              >
                {option.label}
              </div>
              <div className={`address-verification-address`}>
                <div>{option.address.address}</div>
                <div>
                  {option.address.city}, {option.address.state}{' '}
                  {option.address.zipcode}
                </div>
              </div>
            </div>
          )

          const containerClass =
            fieldProps?.value === option.value
              ? `border-primary bg-primary-lighter`
              : ``

          return (
            <div
              className={`address-verification-option border-width-2px border margin-top-1 radius-sm ${containerClass}`}
              key={`${id}.${index}.${option.value}`}
            >
              <Radio
                {...fieldProps}
                id={`${id}.${option.value}`}
                data-testid={`${id}.${option.value}`}
                label={label}
                value={option.value}
                checked={metaProps.value === option.value}
                onChange={handleChange}
                className={`padding-1 padding-top-0`}
                {...inputProps}
                inputRef={index === 0 ? radioRef : undefined}
              />
            </div>
          )
        })}
      </Fieldset>
    </FormGroup>
  )
}
