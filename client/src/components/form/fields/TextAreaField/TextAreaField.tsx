import React, { ReactNode, useRef } from 'react'
import { useField } from 'formik'
import {
  FormGroup,
  Label,
  Textarea,
  ErrorMessage,
} from '@trussworks/react-uswds'

import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

type TextareaProps = Optional<React.ComponentProps<typeof Textarea>, 'id'>

interface ITextAreaFieldProps extends TextareaProps {
  label: ReactNode
  labelClassName?: string
  labelHint?: string
  hint?: ReactNode
}

export const TextAreaField = ({
  label,
  labelClassName,
  labelHint,
  hint,
  ...textareaProps
}: ITextAreaFieldProps) => {
  const [fieldProps, metaProps] = useField({
    name: textareaProps.name,
  })
  const showError = useShowErrors(textareaProps.name)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useFocusFirstError(metaProps.error, textareaRef)

  return (
    <FormGroup error={showError}>
      <Label
        error={showError}
        className={labelClassName}
        hint={labelHint}
        htmlFor={textareaProps.id || textareaProps.name}
      >
        {label}
      </Label>

      <div className="usa-hint" id={`${textareaProps.name}-hint`}>
        {hint}
      </div>

      {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}

      <Textarea
        {...fieldProps}
        value={fieldProps.value || ''}
        id={textareaProps.id || textareaProps.name}
        {...textareaProps}
        inputRef={textareaRef}
        error={showError}
        onInvalid={(e) => e.preventDefault()}
      />
    </FormGroup>
  )
}

export default TextAreaField
