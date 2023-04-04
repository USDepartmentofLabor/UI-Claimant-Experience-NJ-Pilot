import { render, fireEvent } from '@testing-library/react'
import { AddressVerificationField } from './AddressVerificationField'
import { AddressInput } from 'types/claimantInput'

describe('AddressVerificationField', () => {
  const address: AddressInput = {
    address: '123 Test St',
    address2: '',
    city: 'Hoboken',
    state: 'NJ',
    zipcode: '01833',
  }

  it('renders without error', () => {
    render(
      <AddressVerificationField
        name="mailing_address"
        address={address}
        changeAddress={jest.fn()}
        legend={`Which address do you want to use for your mailing address?`}
      />
    )
  })

  it('renders the correct legend', () => {
    const { getByText } = render(
      <AddressVerificationField
        name="mailing_address"
        address={address}
        changeAddress={jest.fn()}
        legend={`Which address do you want to use for your mailing address?`}
      />
    )

    expect(
      getByText('Which address do you want to use for your mailing address?')
    ).toBeInTheDocument()
  })

  it('renders the radio options', () => {
    const { getByLabelText } = render(
      <AddressVerificationField
        name="mailing_address"
        address={address}
        changeAddress={jest.fn()}
        legend={`Which address do you want to use for your mailing address?`}
      />
    )

    expect(getByLabelText('Option 1')).toBeInTheDocument()
    expect(getByLabelText('Option 2')).toBeInTheDocument()
  })

  it('calls the changeAddress callback when a radio option is selected', () => {
    const mockChangeAddress = jest.fn()

    const { getByLabelText } = render(
      <AddressVerificationField
        name="mailing_address"
        address={address}
        changeAddress={mockChangeAddress}
        legend={`Which address do you want to use for your mailing address?`}
      />
    )

    fireEvent.click(getByLabelText('Option 2'))

    expect(mockChangeAddress).toHaveBeenCalledWith(address)
  })
})
