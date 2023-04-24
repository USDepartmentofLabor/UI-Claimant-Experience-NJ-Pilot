import {
  ComponentProps,
  FunctionComponent,
  MouseEventHandler,
  useRef,
  useState,
} from 'react'
import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'next-i18next'
import { useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'

type SubmitButtonProps = Omit<
  ComponentProps<typeof Button>,
  'children' | 'type'
>

export const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  onClick,
  disabled,
  onSubmit,
  ...remainingButtonProps
}) => {
  const { t } = useTranslation('claimForm')
  const [isDisabled, setIsDisabled] = useState(false)
  const { submitForm, isSubmitting, isValid } =
    useFormikContext<Partial<ClaimantInput>>()

  const validRef = useRef(isValid)
  validRef.current = isValid

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setIsDisabled(true)
    submitForm().then(async () => {
      // Make sure we're using the updated isValid value now that the formik form submission was attempted
      if (validRef.current && onSubmit) {
        await onSubmit(e)
      }
    })
    if (onClick) {
      onClick(e)
    }
    setIsDisabled(false)
  }

  return (
    <Button
      type="submit"
      className="width-auto"
      data-testid="submit-button"
      disabled={isSubmitting || disabled || isDisabled}
      {...remainingButtonProps}
      onClick={handleClick}
    >
      {t('pagination.submit')}
    </Button>
  )
}
