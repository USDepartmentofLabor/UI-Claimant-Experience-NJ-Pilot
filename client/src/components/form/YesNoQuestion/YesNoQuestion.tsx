import { BooleanRadio } from 'components/form/fields/BooleanRadio/BooleanRadio'
import { Fieldset } from '@trussworks/react-uswds'
import classnames from 'classnames'
import { useShowErrors } from 'hooks/useShowErrors'
import { ChangeEventHandler, PropsWithChildren } from 'react'
import styles from './YesNoQuestion.module.scss'
import { ReactNode } from 'react'

interface IYesNoQuestionProps {
  id?: string
  name: string
  question: ReactNode
  hint?: string
  yesLabel?: string
  noLabel?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export const YesNoQuestion = ({
  question,
  hint,
  children,
  ...inputProps
}: PropsWithChildren<IYesNoQuestionProps>) => {
  const showError = useShowErrors(inputProps.name)

  return (
    <Fieldset
      legend={question}
      className={classnames(styles.fieldset, 'dol-fieldset', {
        'usa-form-group--error': showError,
      })}
    >
      {hint && (
        <span
          className="usa-hint"
          id={`${inputProps.id || inputProps.name}.hint`}
        >
          {hint}
        </span>
      )}
      <BooleanRadio {...inputProps} />
      {children}
    </Fieldset>
  )
}
