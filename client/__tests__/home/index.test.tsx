import { render, screen } from '@testing-library/react'
import Home from '../../pages/home'

describe('home page', () => {
  it('renders without error', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Apply for unemployment insurance'
    )
  })
})