import classes from './VerifiedFields.module.scss'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type VerifiedFieldsProps = {
  heading?: ReactNode
}

export const VerifiedFields = ({
  heading,
  children,
}: VerifiedFieldsProps & JSX.IntrinsicElements['div']) => {
  const { t } = useTranslation('common')
  const defaultHeading = t('verified_fields.default_heading')
  return (
    <div
      data-testid="verified-fields"
      className="usa-summary-box margin-bottom-4"
    >
      <div className="usa-summary-box__body">
        <h2 className="usa-summary-box__heading">
          {heading ? heading : defaultHeading}
        </h2>
        <div className="usa-summary-box__text">
          <ul className={classes.fieldList}>{children}</ul>
        </div>
      </div>
    </div>
  )
}
