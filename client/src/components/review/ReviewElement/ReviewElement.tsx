import { ReactNode } from 'react'
import styles from './ReviewElement.module.scss'

export type ReviewElementProps = {
  label: ReactNode
  value: string | undefined
  legendProps?: Omit<JSX.IntrinsicElements['legend'], 'className'>
  pProps?: Omit<JSX.IntrinsicElements['p'], 'className'>
} & JSX.IntrinsicElements['fieldset']

export const ReviewElement = ({
  label,
  value,
  legendProps,
  pProps,
  ...fieldSetProps
}: ReviewElementProps) =>
  value === undefined ? null : (
    <fieldset className={styles.fieldset} {...fieldSetProps}>
      <legend className={styles.elementLabel} {...legendProps}>
        {label}
      </legend>
      <p className={styles.elementValue} {...pProps}>
        {value}
      </p>
    </fieldset>
  )
