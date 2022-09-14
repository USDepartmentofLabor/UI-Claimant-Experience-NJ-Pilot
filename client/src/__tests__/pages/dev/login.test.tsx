import { render, screen } from '@testing-library/react'
import DevLogin from 'pages/dev/login'

describe('Dev login page', () => {
  it('renders as expected', () => {
    render(<DevLogin />)
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/middle initial/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/social security number/i)).toBeInTheDocument()
    expect(screen.getByTestId('birthdate.parent-div')).toBeInTheDocument()
  })
})
