import { render, screen } from '@testing-library/react'
import Privacy from 'pages/privacy'

describe('Privacy page', () => {
  it('renders properly', () => {
    render(<Privacy />)
    expect(screen.getByText('heading')).toBeInTheDocument()
    expect(screen.getByText('p1')).toBeInTheDocument()
    expect(screen.getByText('p2')).toBeInTheDocument()
  })
})
