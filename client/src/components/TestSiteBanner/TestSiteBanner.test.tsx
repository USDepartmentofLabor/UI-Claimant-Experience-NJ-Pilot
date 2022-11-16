import { render, screen } from '@testing-library/react'
import { TestSiteBanner } from './TestSiteBanner'

describe('TestSiteBanner', () => {
  it('renders without error', () => {
    render(<TestSiteBanner />)
    expect(screen.getByText('test_banner'))
  })
})
