import { ReactNode } from 'react'
import { Link } from '@trussworks/react-uswds'

import styles from './ReviewSection.module.scss'
import { useTranslation } from 'next-i18next'

type ReviewSectionProps = {
  heading: string | ReactNode
  editUrl?: string
  children?: ReactNode
}

export const ReviewSection = ({
  heading,
  editUrl,
  children,
}: ReviewSectionProps) => {
  const { t } = useTranslation('claimForm')

  return (
    <section
      aria-label={t('review.section.accessible_name', { name: heading })}
    >
      <h2 className={styles.sectionHeading}>{heading}</h2>
      {editUrl !== undefined && (
        <Link
          href={editUrl}
          aria-label={t('review.edit.accessible_name', { name: heading })}
        >
          {t('review.edit.label')}
        </Link>
      )}
      {children}
    </section>
  )
}
