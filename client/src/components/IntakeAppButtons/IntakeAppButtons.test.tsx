import { render, screen } from '@testing-library/react'
import { IntakeAppButtons } from './IntakeAppButtons'

describe('IntakeAppButtons', () => {
  it('renders without error', () => {
    render(
      <IntakeAppButtons>
        <button>Click me</button>
      </IntakeAppButtons>
    )

    expect(screen.getByTestId('intake-app-buttons-wrapper')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument()
  })
})
