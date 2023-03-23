import { render } from '@testing-library/react'
import { AddressVerificationField } from './AddressVerificationField'

const MAILING_ADDRESS_OPTIONS = [
  {
    label: 'You entered:',
    address: {
      address: '123 Test St',
      address2: '',
      city: 'Hoboken',
      state: 'NJ',
      zipcode: '01833',
    },
    value: 'as-entered',
  },
  {
    label: 'U.S. Postal Service recommends:',
    address: {
      address: '1234 Test St',

      address2: '',
      city: 'Hoboken',
      state: 'NJ',
      zipcode: '01833',
    },
    value: 'as-verified',
  },
]

describe('AddressVerificationField', () => {
  it('renders without error', () => {
    render(
      <AddressVerificationField
        name="mailing_address"
        options={MAILING_ADDRESS_OPTIONS}
        legend={`Which address do you want to use for your mailing address?`}
      />
    )
  })
})
