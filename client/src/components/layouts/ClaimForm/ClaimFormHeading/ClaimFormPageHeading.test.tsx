import { ClaimFormPageHeading } from 'components/layouts/ClaimForm/ClaimFormHeading/ClaimFormPageHeading'
import { render, screen } from '@testing-library/react'

describe('ClaimFormPageHeading', () => {
  it('renders properly', () => {
    render(
      <ClaimFormPageHeading
        pageHeading={'test-heading'}
        step={1}
        totalSteps={2}
      />
    )

    const claimFormPageHeading = screen.getByText('test-heading')

    expect(claimFormPageHeading).toBeInTheDocument()
  })
})
