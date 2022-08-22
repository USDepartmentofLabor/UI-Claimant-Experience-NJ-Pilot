import { render, screen } from '@testing-library/react'
import { VerifiedField } from './VerifiedField'

describe('VerifiedField', () => {
  it('can render without error', () => {
    render(<VerifiedField label="My field" value="Something else" />)
    expect(screen.getByRole('listitem')).toBeInTheDocument()
    expect(screen.getByTestId('verified-field-label')).toBeInTheDocument()
    expect(screen.getByTestId('verified-field-label')).toHaveTextContent(
      'My field'
    )
    expect(screen.getByTestId('verified-field-value')).toBeInTheDocument()
    expect(screen.getByTestId('verified-field-value')).toHaveTextContent(
      'Something else'
    )
  })

  it('can accept an array as a value prop and render as a string', () => {
    render(<VerifiedField label="My dogs" value={['Moxie', 'Max']} />)
    expect(screen.getByTestId('verified-field-label')).toHaveTextContent(
      'My dogs'
    )
    expect(screen.getByTestId('verified-field-value')).toHaveTextContent(
      'Moxie, Max'
    )
  })

  it('can accept and render children', () => {
    render(
      <VerifiedField label="My address">
        <div>123 Main St.</div>
        <div>Trenton, NJ</div>
      </VerifiedField>
    )

    expect(screen.getByText('123 Main St.')).toBeInTheDocument()
  })
})
