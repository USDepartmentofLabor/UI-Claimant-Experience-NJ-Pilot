import {
  DetailedHTMLProps,
  forwardRef,
  ForwardRefRenderFunction,
  HTMLAttributes,
  RefObject,
} from 'react'
import { useTranslation } from 'react-i18next'

import styles from './ClaimFormHeading.module.scss'

type ClaimFormHeadingProps = {
  pageHeading: string
  step: number
  totalSteps: number
  headingRef?: RefObject<HTMLHeadingElement>
}

const ClaimFormPageHeadingForwardRef: ForwardRefRenderFunction<
  HTMLHeadingElement,
  ClaimFormHeadingProps
> = (
  {
    pageHeading,
    step,
    totalSteps,
  }: ClaimFormHeadingProps &
    DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
  ref
) => {
  const { t } = useTranslation('claimForm')

  return (
    <h1
      data-testid="claim-form-page-heading"
      ref={ref}
      tabIndex={-1}
      className={`${styles.pageHeading}`}
      aria-label={`${pageHeading} ${t('step_progress', {
        step,
        totalSteps,
      })}`}
    >
      {pageHeading}
    </h1>
  )
}

export const ClaimFormPageHeading = forwardRef(ClaimFormPageHeadingForwardRef)
