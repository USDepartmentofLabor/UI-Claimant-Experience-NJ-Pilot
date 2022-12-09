import { TextField } from '../TextField/TextField'
import React, {
  ChangeEventHandler,
  ComponentProps,
  ReactNode,
  useEffect,
  useRef,
  useState,
  FocusEventHandler,
} from 'react'
import { useField } from 'formik'
import { CURRENCY_REGEX } from 'constants/currency/format'
import {
  convertCentsToDollars,
  convertCentsToDollarsAsTyped,
  convertDollarsToCents,
} from 'utils/currency/conversion'
import {
  ErrorMessage,
  FormGroup,
  InputPrefix,
  InputSuffix,
  Label,
  TextInput,
} from '@trussworks/react-uswds'
import classnames from 'classnames'
import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

type TextInputProps = Optional<
  Omit<ComponentProps<typeof TextField>, 'type'>,
  'id'
>

interface CurrencyFieldProps extends TextInputProps {
  name: string
  label: string
  labelClassName?: string
  labelHint?: string
  hint?: ReactNode
  inputPrefix?: ReactNode
  inputSuffix?: ReactNode
}

export const CurrencyField = ({
  id,
  name,
  label,
  labelClassName,
  labelHint,
  hint,
  inputPrefix = '$',
  inputSuffix,
  ...inputProps
}: CurrencyFieldProps) => {
  const [fieldProps, metaProps, fieldHelperProps] = useField<
    string | undefined
  >(name)

  const isMounted = useRef(false)
  const [dollarValue, setDollarValue] = useState<string>(() =>
    metaProps.initialValue ? convertCentsToDollars(metaProps.initialValue) : ''
  )

  const [focused, setFocused] = useState(false)
  const showError = useShowErrors(name)
  const showErrorOutline = showError && !focused
  const textFieldRef = useRef<HTMLInputElement>(null)

  useFocusFirstError(metaProps.error, textFieldRef)

  useEffect(() => {
    // prevent unnecessary calculation on initial mount
    if (isMounted.current) {
      const getFormikValue = () => {
        if (!dollarValue) {
          return ''
        }
        if (dollarValue.match(CURRENCY_REGEX)) {
          return convertDollarsToCents(dollarValue)
        }
        // don't set to fixed value so that validation can apply
        return String(Number(dollarValue) * 100)
      }
      fieldHelperProps.setValue(getFormikValue()) // Should await?
    } else {
      isMounted.current = true
    }
  }, [dollarValue])

  useEffect(() => {
    // Reassign display (local state) value if the formik and display currency are not equivalent (ex. this can occur when an item of an array that includes this field is removed)
    // change the state to dollar equivalent of the fieldProps.value
    if (fieldProps.value === undefined || fieldProps.value === '') {
      setDollarValue('')
      return
    }
    if (fieldProps.value !== undefined && !isNaN(Number(fieldProps.value))) {
      const formikDollars = convertCentsToDollars(fieldProps.value)
      if (dollarValue !== formikDollars) {
        setDollarValue(
          convertCentsToDollarsAsTyped(
            fieldProps.value,
            fieldProps.value.length
          )
        )
      }
    }
  }, [fieldProps.value])

  const handleFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setDollarValue(e.target.value)
    if (inputProps?.onChange) {
      inputProps.onChange(e)
    }
  }

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setFocused(false)
    fieldProps.onBlur(e)
  }

  const textInput = (
    <TextInput
      {...fieldProps}
      type="text"
      data-testid={id}
      value={dollarValue || ''}
      validationStatus={showErrorOutline ? 'error' : undefined}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      id={id || name}
      onChange={handleFieldChange}
      onInvalid={(e) => e.preventDefault()}
      {...inputProps}
    />
  )

  return (
    <FormGroup error={showError}>
      <Label
        className={labelClassName}
        hint={labelHint}
        error={showError}
        htmlFor={id || name}
      >
        {label}
      </Label>
      {inputSuffix || inputPrefix ? (
        <div
          className={classnames('usa-input-group', {
            'usa-input-group--error': showErrorOutline,
            'is-focused': focused,
          })}
          data-testid={`${name}-input-group`}
        >
          {inputPrefix && <InputPrefix>{inputPrefix}</InputPrefix>}
          {textInput}
          {inputSuffix && <InputSuffix>{inputSuffix}</InputSuffix>}
        </div>
      ) : (
        textInput
      )}
      <div className="usa-hint" id={`${name}-hint`}>
        {hint}
      </div>
      {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
    </FormGroup>
  )
}
