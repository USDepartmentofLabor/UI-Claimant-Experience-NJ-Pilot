import { FunctionComponent } from 'react'
import { Button } from '@trussworks/react-uswds'

export const SubmitButton: FunctionComponent<
  JSX.IntrinsicElements['button']
> = ({ disabled, onClick, children, ...remainingProps }) => {
  return (
    <Button
      className="width-auto"
      disabled={disabled}
      type="submit"
      onClick={onClick}
      {...remainingProps}
    >
      {children}
    </Button>
  )
}
