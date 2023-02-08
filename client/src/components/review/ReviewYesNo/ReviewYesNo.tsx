import {
  ReviewElement,
  ReviewElementProps,
} from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'

type ReviewYesNoProps = {
  label: ReviewElementProps['label']
  value: boolean | undefined
}

export const ReviewYesNo = ({ label, value }: ReviewYesNoProps) => {
  const { t } = useTranslation('common')

  return value === undefined ? null : (
    <ReviewElement label={label} value={value ? t('yes') : t('no')} />
  )
}
