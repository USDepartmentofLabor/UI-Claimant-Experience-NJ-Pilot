import { render, screen } from '@testing-library/react'
import PageLoader from './PageLoader'

describe('PageLoader', () => {
  it('renders properly', () => {
    render(<PageLoader />)
    expect(screen.getByText('page_loader')).toBeInTheDocument()
  })
})
