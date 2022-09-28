import {
  DetailedHTMLProps,
  forwardRef,
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react'

import styles from './ClaimFormHeading.module.scss'

const PageHeadingForwardRef: ForwardRefRenderFunction<
  HTMLHeadingElement,
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = (
  {
    children,
  }: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
  ref
) => {
  return (
    <h1
      data-testid="claim-form-page-heading"
      ref={ref}
      tabIndex={-1}
      className={`${styles.pageHeading}`}
    >
      {children}
    </h1>
  )
}

export const PageHeading = forwardRef(PageHeadingForwardRef)
