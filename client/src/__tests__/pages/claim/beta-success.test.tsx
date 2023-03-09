import { render, screen } from '@testing-library/react'
import BetaSuccess from 'pages/claim/beta-success'

describe('success page', () => {
  const renderSuccessPage = () => {
    render(<BetaSuccess />)

    const heading = screen.getByRole('heading', { level: 1 })

    const details = screen.queryByText('success_details')
    const contactMsg = screen.queryByText('contact_details')
    const signOutButton = screen.queryByRole('button', {
      name: 'signout',
    })

    const updatePaymentButton = screen.queryByRole('button', {
      name: 'update_payment_button',
    })
    const updateContactInfoButton = screen.queryByRole('button', {
      name: 'update_contact_info_button',
    })
    const taxDocButton = screen.queryByRole('button', {
      name: 'tax_doc_button',
    })

    return {
      heading,
      details,
      contactMsg,
      signOutButton,
      taxDocButton,
      updatePaymentButton,
      updateContactInfoButton,
    }
  }
  it('renders page', () => {
    const {
      heading,
      details,
      contactMsg,
      signOutButton,
      taxDocButton,
      updatePaymentButton,
      updateContactInfoButton,
    } = renderSuccessPage()

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('heading')
    expect(details).toBeInTheDocument()
    expect(contactMsg).toBeInTheDocument()
    expect(signOutButton).toBeInTheDocument()
    expect(taxDocButton).toBeInTheDocument()
    expect(updatePaymentButton).toBeInTheDocument()
    expect(updateContactInfoButton).toBeInTheDocument()
  })
})
