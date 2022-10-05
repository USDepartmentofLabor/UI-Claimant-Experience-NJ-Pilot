import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('shows errors on submit when expected', async () => {
    const user = userEvent.setup()
    render(<DevLogin />)

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getAllByRole('alert')).toHaveLength(6)
  })

  // TODO: get this test working
  // it('triggers handleSubmit when form is valid', () => {
  //   const user = userEvent.setup()
  //   render(<DevLogin />)
  //   const spy = jest.spyOn(window, 'alert').mockImplementation(jest.fn())
  //
  //   const claimantInput = {
  //     first_name: 'Hermione',
  //     last_name: 'Grainger',
  //     email: 'test@test.com',
  //     phone: '5556665555',
  //     ssn: '999-99-9999',
  //   }
  //
  //   user.type(
  //     screen.getByRole('textbox', { name: /first name/i }),
  //     claimantInput.first_name
  //   )
  //   user.type(
  //     screen.getByRole('textbox', { name: /last name/i }),
  //     claimantInput.last_name
  //   )
  //   user.type(
  //     screen.getByRole('textbox', { name: /email address/i }),
  //     claimantInput.email
  //   )
  //   user.type(
  //     screen.getByRole('textbox', { name: /phone number/i }),
  //     claimantInput.phone
  //   )
  //   user.type(
  //     screen.getByRole('textbox', { name: /phone number/i }),
  //     claimantInput.ssn
  //   )
  //   user.type(screen.getByRole('textbox', { name: /month/i }), '05')
  //   user.type(screen.getByRole('textbox', { name: /day/i }), '23')
  //   user.type(screen.getByRole('textbox', { name: /year/i }), '2001')
  //   user.click(screen.getByRole('button', { name: /submit/i }))
  //
  //   expect(spy).toHaveBeenCalled()
  // })
})
