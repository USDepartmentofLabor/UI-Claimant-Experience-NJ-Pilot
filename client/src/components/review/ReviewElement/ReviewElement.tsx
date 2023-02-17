import { ReactNode, useState } from 'react'
import styles from './ReviewElement.module.scss'
import { Icon } from '@trussworks/react-uswds/'

export type ReviewElementProps = {
  label: ReactNode
  value: string | null | undefined
  legendProps?: Omit<JSX.IntrinsicElements['legend'], 'className'>
  pProps?: Omit<JSX.IntrinsicElements['p'], 'className'>
  maskable?: boolean
  defaultMasked?: boolean
} & JSX.IntrinsicElements['fieldset']

export const ReviewElement = ({
  label,
  value,
  legendProps,
  pProps,
  maskable,
  defaultMasked = true,
  ...fieldSetProps
}: ReviewElementProps) =>
  value ? (
    <fieldset className={styles.fieldset} {...fieldSetProps}>
      <legend className={styles.elementLabel} {...legendProps}>
        {label}
      </legend>
      <p className={styles.elementValue} {...pProps}>
        {maskable ? (
          <MaskedValue
            label={label}
            value={value}
            defaultMasked={defaultMasked}
          />
        ) : (
          value
        )}
      </p>
    </fieldset>
  ) : null

type MaskedValueProps = {
  label: ReactNode
  value: string
  defaultMasked?: boolean
}

const MaskedValue = ({
  label,
  value,
  defaultMasked = true,
}: MaskedValueProps) => {
  const [masked, setVisible] = useState(defaultMasked)
  return (
    <>
      {masked ? '•'.repeat(value.length) : value}{' '}
      <button
        className={styles.elementVisibilityToggle}
        onClick={() => setVisible(!masked)}
        type="button"
      >
        <span className="screen-reader-only">
          {masked ? 'Show' : 'Hide'} {label}
        </span>
        {masked ? (
          <Icon.Visibility className={styles.visibilityIcon} />
        ) : (
          <Icon.VisibilityOff className={styles.visibilityIcon} />
        )}
      </button>
    </>
  )
}
