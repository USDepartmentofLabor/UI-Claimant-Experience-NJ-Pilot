import { render, screen } from '@testing-library/react'
import { NoCurrentClaimHome } from './NoCurrentClaimHome'

jest.unmock('react-i18next')

describe('NoCurrentClaimHome', () => {
  it('renders how to apply is header 2', () => {
    render(<NoCurrentClaimHome />)
    const level2Headings = screen.getAllByRole('heading', { level: 2 })
    level2Headings &&
      expect(level2Headings[0]).toHaveTextContent('How to apply')
  })

  it('eligibility link navigates to link in a new tab', async () => {
    render(<NoCurrentClaimHome />)

    const eligibilityLink = screen.getByTestId('eligibility')
    expect(eligibilityLink).toBeInTheDocument()
    expect(eligibilityLink).toHaveAttribute(
      'href',
      'https://nj.gov/labor/myunemployment/before/about/who/'
    )
  })
})
