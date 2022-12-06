import React, { ChangeEvent, useRef } from 'react'
import { useField } from 'formik'
import {
  FormGroup,
  Label,
  Dropdown,
  ErrorMessage,
} from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

export type DropdownOption = {
  label: string
  value: string
}

const EMPTY_OPTION_VALUE = ''

interface IDropdownFieldProps {
  id?: string
  name: string
  formGroupClassName?: string
  label: React.ReactNode
  labelClassName?: string
  labelHint?: string
  options: DropdownOption[] | Record<string, DropdownOption[]>
  startEmpty?: boolean
}
/**
 * This component renders a ReactUSWDS Dropdown component inside of a FormGroup,
 * with a Label and ErrorMessage.
 *
 * It relies on the Formik useField hook to work, so it must ALWAYS be rendered
 * inside of a Formik form context.
 *
 * If you want to use these components outside a Formik form, you can use the
 * ReactUSWDS components directly.
 */

const DropdownField = ({
  name,
  id: idProp,
  formGroupClassName,
  label,
  labelClassName,
  labelHint,
  options,
  startEmpty,
  onChange,
  ...inputProps
}: IDropdownFieldProps & JSX.IntrinsicElements['select']) => {
  const { t } = useTranslation('common')
  const [fieldProps, metaProps] = useField({ name })
  const showError = useShowErrors(name)
  const selectRef = useRef<HTMLSelectElement>(null)

  useFocusFirstError(metaProps.error, selectRef)

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    fieldProps.onChange(e)
    if (onChange) {
      onChange(e)
    }
  }

  const id = idProp || name

  const mapOptions = (options: DropdownOption[]) => {
    return options.map(({ label, value }, index) => (
      <option key={`${index}_${label}_${value}`} value={value}>
        {label}
      </option>
    ))
  }

  return (
    <FormGroup className={formGroupClassName} error={showError}>
      <Label
        className={labelClassName}
        hint={labelHint}
        error={showError}
        htmlFor={id}
      >
        {label}
      </Label>

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Dropdown
        id={id}
        data-testid={id}
        {...fieldProps}
        onChange={handleChange}
        {...inputProps}
        inputRef={selectRef}
      >
        {startEmpty && (
          <option key="empty" value={EMPTY_OPTION_VALUE}>
            {t('select')}
          </option>
        )}
        {Array.isArray(options)
          ? mapOptions(options)
          : Object.entries(options).map(([key, value]) => (
              <optgroup key={`${name}_${key}`} label={key}>
                {mapOptions(value)}
              </optgroup>
            ))}
      </Dropdown>

      {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
    </FormGroup>
  )
}

export default DropdownField
