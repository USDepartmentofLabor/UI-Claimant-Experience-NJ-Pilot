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
import { useRouter } from 'next/router'

type NextButtonProps = {
  nextPage: string
} & Omit<ComponentProps<typeof Button>, 'children' | 'type'>

export const NextButton: FunctionComponent<NextButtonProps> = ({
  nextPage,
  onClick,
  disabled,
  ...remainingButtonProps
}) => {
  const router = useRouter()
  const { t } = useTranslation('claimForm')
  const { isValid, isSubmitting, setSubmitting, submitForm } =
    useFormikContext<Partial<ClaimantInput>>()

  const validRef = useRef(isValid)
  validRef.current = isValid

  const handleGoNext: MouseEventHandler<HTMLButtonElement> = async () => {
    await router.push(nextPage)
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
    if (onClick) {
      onClick(e)
    }
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
      {t('pagination.next')}
    </Button>
  )
}
