import { ReactNode } from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import classes from './VerifiedField.module.scss'

type VerifiedFieldProps = {
  label: string
  value?: string | string[]
  children?: ReactNode
}

export const VerifiedField = ({
  label,
  value,
  children,
}: VerifiedFieldProps) => {
  const getDisplayValue = (value: any) => {
    let displayValue = value
    if (Array.isArray(value)) {
      displayValue = value.join(', ')
    }
    return displayValue
  }

  const displayValue = getDisplayValue(value)

  return (
    <li className={classes.field}>
      <div data-testid="verified-field-label">{label}</div>
      <div
        className={classNames(classes.fieldValue, {
          [classes.withChildren]: children,
        })}
      >
        <Icon
          icon={faCheck}
          size="1x"
          data-testid="check-icon"
          className={classNames(`text-info-dark ${classes.icon}`)}
          aria-hidden="true"
        />
        {children ? (
          children
        ) : (
          <div data-testid="verified-field-value" className={classes.text}>
            {displayValue}
          </div>
        )}
      </div>
    </li>
  )
}
