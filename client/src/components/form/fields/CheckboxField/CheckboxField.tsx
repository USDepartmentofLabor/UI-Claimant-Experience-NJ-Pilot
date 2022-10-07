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

export const CheckboxField = ({
  name,
  id,
  onChange,
  ...inputProps
}: Optional<React.ComponentProps<typeof Checkbox>, 'id'>) => {
  const [fieldProps, metaProps] = useField({ name, type: 'checkbox' })

  const showError = useShowErrors(name)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    fieldProps.onChange(e)
    if (onChange) {
      onChange(e)
    }
  }

  /* eslint-disable-next-line react/jsx-props-no-spreading */
  return (
    <FormGroup error={showError}>
      <Checkbox
        {...fieldProps}
        name={name}
        id={id || name}
        onChange={handleChange}
        {...inputProps}
      />
      {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
    </FormGroup>
  )
}

export default CheckboxField
