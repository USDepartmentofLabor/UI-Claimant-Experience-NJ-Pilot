import React, { ChangeEvent } from 'react'
import { useField } from 'formik'
import { Checkbox, ErrorMessage, FormGroup } from '@trussworks/react-uswds'
import { useShowErrors } from 'hooks/useShowErrors'

/**
 * This component renders a checkbox
 *
 * It relies on the Formik useField hook to work, so it must ALWAYS be rendered
 * inside of a Formik form context.
 *
 * If you want to use these components outside a Formik form, you can use the
 * ReactUSWDS components directly.
 */

type CheckboxFieldProps = {
  showsErrors?: boolean
  formGroupClassName?: string
}

export const CheckboxField = ({
  name,
  id,
  onChange,
  showsErrors = true,
  formGroupClassName,
  ...inputProps
}: CheckboxFieldProps &
  Optional<React.ComponentProps<typeof Checkbox>, 'id'>) => {
  const [fieldProps, metaProps] = useField({ name, type: 'checkbox' })

  const showError = showsErrors && useShowErrors(name)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    fieldProps.onChange(e)
    if (onChange) {
      onChange(e)
    }
  }

  /* eslint-disable-next-line react/jsx-props-no-spreading */
  return (
    <FormGroup className={formGroupClassName} error={showError}>
      <Checkbox
        {...fieldProps}
        name={name}
        id={id || name}
        onChange={handleChange}
        onInvalid={(e) => e.preventDefault()}
        {...inputProps}
      />
      {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
    </FormGroup>
  )
}

export default CheckboxField
