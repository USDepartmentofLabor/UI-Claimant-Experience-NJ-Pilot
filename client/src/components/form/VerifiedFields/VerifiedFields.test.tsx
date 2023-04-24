import { render, screen } from '@testing-library/react'
import { VerifiedFields } from './VerifiedFields'
import { VerifiedField } from './VerifiedField/VerifiedField'

describe('VerifiedFields Component', () => {
  it('renders component and children without error', () => {
    render(
      <VerifiedFields heading="Heading">
        <VerifiedField label="Label" value="Vader, I am your child" />
        <VerifiedField label="Label2" value="Skywalker, you are my child" />
      </VerifiedFields>
    )

    const heading = screen.getByRole('heading')

    const checkIcons = screen.getAllByTestId('check-icon')

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/heading/i)

    expect(checkIcons).toHaveLength(2)
    checkIcons.forEach((checkIcon) => {
      expect(checkIcon).toHaveClass('text-info-dark')
      expect(checkIcon).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
