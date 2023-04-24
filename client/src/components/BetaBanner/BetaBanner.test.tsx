import { render, screen } from '@testing-library/react'
import { BetaBanner } from './BetaBanner'

describe('BetaBanner', () => {
  it('renders without error', () => {
    render(<BetaBanner />)
    expect(screen.getByText('beta_banner.description'))
    expect(screen.getByText('beta_banner.disclaimer'))
  })
})
