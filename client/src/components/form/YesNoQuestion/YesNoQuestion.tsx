import { BooleanRadio } from 'components/form/fields/BooleanRadio/BooleanRadio'
import { ErrorMessage, Fieldset, FormGroup } from '@trussworks/react-uswds'
import classnames from 'classnames'
import { useShowErrors } from 'hooks/useShowErrors'
import { ChangeEventHandler, PropsWithChildren, ReactNode } from 'react'
import styles from './YesNoQuestion.module.scss'
import { useField } from 'formik'

interface IYesNoQuestionProps {
  id?: string
  name: string
  question: ReactNode
  hint?: ReactNode
  yesLabel?: string
  noLabel?: string
  isStacked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const YesNoQuestion = ({
  question,
  hint,
  children,
  ...inputProps
}: PropsWithChildren<IYesNoQuestionProps>) => {
  const [, metaProps] = useField(inputProps.name)
  const showError = useShowErrors(inputProps.name)

  return (
    <FormGroup error={showError}>
      <Fieldset
        legend={question}
        className={classnames(styles.fieldset, 'dol-fieldset', {
          [styles.errorLegend]: showError,
        })}
        onInvalid={(e) => e.preventDefault()}
      >
        {hint && (
          <span
            className="usa-hint"
            id={`${inputProps.id || inputProps.name}.hint`}
          >
            {hint}
          </span>
        )}
        {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
        <BooleanRadio showsErrors={false} {...inputProps} />
        {children}
      </Fieldset>
    </FormGroup>
  )
}
