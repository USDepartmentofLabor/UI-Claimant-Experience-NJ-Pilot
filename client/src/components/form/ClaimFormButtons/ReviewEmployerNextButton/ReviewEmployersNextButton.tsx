import {
  ComponentProps,
  FunctionComponent,
  MouseEventHandler,
  useRef,
} from 'react'
import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'next-i18next'
import { useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'

type NextButtonProps = { type: 'add' | 'edit' } & Omit<
  ComponentProps<typeof Button>,
  'children' | 'type'
>

export const ReviewEmployersNextButton: FunctionComponent<NextButtonProps> = ({
  type,
  onClick,
  disabled,
  ...remainingButtonProps
}) => {
  const { t } = useTranslation('claimForm')
  const { isValid, isSubmitting, setSubmitting, submitForm } =
    useFormikContext<Partial<ClaimantInput>>()

  const validRef = useRef(isValid)
  validRef.current = isValid

  const handleGoNext: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (onClick) await onClick(e)
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    submitForm().then(async () => {
      // Make sure we're using the updated isValid value now that the formik form submission was attempted
      if (validRef.current) {
        setSubmitting(true)
        await handleGoNext(e)
        setSubmitting(false)
      }
    })
  }

  return (
    <Button
      type="submit"
      className="width-auto"
      data-testid="next-button"
      disabled={disabled || isSubmitting}
      {...remainingButtonProps}
      onClick={handleClick}
    >
      {type === 'add' ? t('review_employers.add') : t('review_employers.save')}
    </Button>
  )
}
