import { render, screen } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner', () => {
  it('renders with a label', () => {
    render(<Spinner label="Loading" />)
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('renders with a custom class', () => {
    const { container } = render(<Spinner className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
