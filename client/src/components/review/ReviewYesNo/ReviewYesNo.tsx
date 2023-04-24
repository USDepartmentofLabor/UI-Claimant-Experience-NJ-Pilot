import {
  ReviewElement,
  ReviewElementProps,
} from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
import { CheckboxInput, YesNoInput } from 'types/claimantInput'

type ReviewYesNoProps = {
  label: ReviewElementProps['label']
  value: YesNoInput | undefined | CheckboxInput
}

export const ReviewYesNo = ({ label, value }: ReviewYesNoProps) => {
  const { t } = useTranslation('common')

  return value === undefined || value === null ? null : (
    <ReviewElement label={label} value={value ? t('yes') : t('no')} />
  )
}
