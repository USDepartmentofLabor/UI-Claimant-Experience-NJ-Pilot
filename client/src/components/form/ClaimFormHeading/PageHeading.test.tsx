import { PageHeading } from 'components/form/ClaimFormHeading/PageHeading'
import { render, screen } from '@testing-library/react'

describe('PageHeading', () => {
  it('renders properly', () => {
    render(<PageHeading />)

    const pageHeading = screen.getByTestId('claim-form-page-heading')

    expect(pageHeading).toBeInTheDocument()
  })
})
