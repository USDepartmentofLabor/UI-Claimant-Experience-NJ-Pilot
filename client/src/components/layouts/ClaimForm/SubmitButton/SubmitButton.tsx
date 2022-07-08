import { ComponentProps, FunctionComponent } from 'react'
import { Button } from '@trussworks/react-uswds'

type SubmitButtonProps = Pick<
  ComponentProps<typeof Button>,
  'disabled' | 'onClick' | 'children'
>

export const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  disabled,
  onClick,
  children,
}) => {
  return (
    <Button
      className="width-auto"
      disabled={disabled}
      type="submit"
      data-testid="submit-button"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
