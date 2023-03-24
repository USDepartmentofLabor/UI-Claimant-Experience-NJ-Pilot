import { render, fireEvent, screen } from '@testing-library/react'
import { Formik, Form } from 'formik'
import { AddressVerificationField } from './AddressVerificationField'
import { AddressOption } from 'types/claimantInput'

describe('AddressVerificationField component', () => {
  const options: AddressOption[] = [
    {
      label: 'Address 1',
      value: 'address1',
      address: {
        address: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
      },
    },
    {
      label: 'Address 2',
      value: 'address2',
      address: {
        address: '1234 Test St',
        address2: '',
        city: 'Hoboken',
        state: 'NJ',
        zipcode: '01833',
      },
    },
  ]

  const renderComponent = (props = {}) => {
    const mockSubmit = jest.fn()

    return render(
      <Formik initialValues={{ addressVerification: '' }} onSubmit={mockSubmit}>
        <Form data-testid="address-verification-form">
          <AddressVerificationField
            name="addressVerification"
            options={options}
            {...props}
          />
        </Form>
      </Formik>
    )
  }

  it('renders options correctly', () => {
    renderComponent()
    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
      expect(screen.getByText(option.address.address)).toBeInTheDocument()
      if (option.address.address2) {
        expect(screen.getByText(option.address.address2)).toBeInTheDocument()
      }
      expect(
        screen.getByText(
          `${option.address.city}, ${option.address.state} ${option.address.zipcode}`
        )
      ).toBeInTheDocument()
    })
  })

  it('handles value changes correctly', () => {
    renderComponent()
    const radio1 = screen.getByTestId('addressVerification.address1')
    const radio2 = screen.getByTestId('addressVerification.address2')

    fireEvent.click(radio1)
    expect(radio1).toBeChecked()
    expect(radio2).not.toBeChecked()

    fireEvent.click(radio2)
    expect(radio1).not.toBeChecked()
    expect(radio2).toBeChecked()
  })

  it('displays the hint correctly', () => {
    const hintText = 'Please select an address'
    renderComponent({ hint: hintText })

    expect(screen.getByText(hintText)).toBeInTheDocument()
  })

  it('renders custom fieldset className when provided', () => {
    const fieldsetClassName = 'custom-fieldset-class'
    renderComponent({ fieldsetClassName })

    expect(screen.getByRole('group')).toHaveClass(fieldsetClassName)
  })

  it('calls onChange callback when provided', () => {
    const handleChange = jest.fn()
    renderComponent({ onChange: handleChange })

    fireEvent.click(screen.getByTestId('addressVerification.address1'))
    expect(handleChange).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTestId('addressVerification.address2'))
    expect(handleChange).toHaveBeenCalledTimes(2)
  })
})
