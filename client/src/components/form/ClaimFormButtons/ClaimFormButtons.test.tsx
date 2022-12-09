import { render, screen } from '@testing-library/react'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { Button } from '@trussworks/react-uswds'

const buttonOne = <Button type="button">One</Button>
const buttonTwo = <Button type="button">Two</Button>
const buttonThree = <Button type="button">Three</Button>

describe('ClaimFormButtons component', () => {
  it('renders properly', () => {
    render(
      <ClaimFormButtons nextStep="step two">
        {buttonOne}
        {buttonTwo}
        {buttonThree}
      </ClaimFormButtons>
    )

    const one = screen.getByRole('button', { name: /One/i })
    const two = screen.getByRole('button', { name: /Two/i })
    const three = screen.getByRole('button', { name: /Three/i })

    expect(one).toBeInTheDocument()
    expect(two).toBeInTheDocument()
    expect(three).toBeInTheDocument()

    const headingDiv = screen.queryByTestId('claim-form-buttons-next-step')

    expect(headingDiv).toBeInTheDocument()
  })

  it('does not render nextStep div if no header is defined', () => {
    render(
      <ClaimFormButtons>
        {buttonOne}
        {buttonTwo}
        {buttonThree}
      </ClaimFormButtons>
    )

    const nextStepDiv = screen.queryByTestId('claim-form-buttons-next-step')

    expect(nextStepDiv).not.toBeInTheDocument()
  })
})
