import classes from './VerifiedFields.module.scss'
import { ReactNode } from 'react'

type VerifiedFieldsProps = {
  heading: ReactNode
}

export const VerifiedFields = ({
  heading,
  children,
}: VerifiedFieldsProps & JSX.IntrinsicElements['div']) => {
  return (
    <div
      data-testid="verified-fields"
      className="usa-summary-box margin-bottom-6"
    >
      <div className="usa-summary-box__body">
        <h2 className="usa-summary-box__heading">{heading}</h2>
        <div className="usa-summary-box__text">
          <ul className={classes.fieldList}>{children}</ul>
        </div>
      </div>
    </div>
  )
}
