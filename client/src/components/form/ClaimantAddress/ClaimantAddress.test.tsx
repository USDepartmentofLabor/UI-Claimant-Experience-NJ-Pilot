import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { ClaimantAddress } from 'components/form/ClaimantAddress/ClaimantAddress'
import { noop } from 'helpers/noop/noop'
import { PersonalPageDefinition } from 'pages/claim/personal'
import userEvent from '@testing-library/user-event'

describe('ClaimantAddress component', () => {
  const initialValues = PersonalPageDefinition.initialValues

  it('renders properly', () => {
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <ClaimantAddress />
      </Formik>
    )

    const residenceAddress = screen.queryByRole('group', {
      name: 'label.primary_address',
    })
    const mailingAddressSame = screen.queryByRole('checkbox', {
      name: 'label.mailing_address_same',
    })
    const mailingAddress = screen.queryByRole('group', {
      name: 'label.mailing_address',
    })

    expect(residenceAddress).toBeInTheDocument()
    expect(mailingAddressSame).toBeInTheDocument()
    expect(mailingAddressSame).not.toBeChecked()
    expect(mailingAddress).toBeInTheDocument()
  })

  it('hides and shows the mailing_address field', async () => {
    const user = userEvent.setup()

    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <ClaimantAddress />
      </Formik>
    )

    const mailingAddressSame = screen.getByRole('checkbox', {
      name: 'label.mailing_address_same',
    })
    const mailingAddress = screen.getByRole('group', {
      name: 'label.mailing_address',
    })

    // Toggle mailing address off (mailing address is same)
    await user.click(mailingAddressSame)

    expect(mailingAddress).not.toBeInTheDocument()

    // Toggle mailing address on (mailing address is not same)
    await user.click(mailingAddressSame)

    const mailingAddressReturned = await screen.findByRole('group', {
      name: 'label.mailing_address',
    })

    expect(mailingAddressReturned).toBeInTheDocument()
  })

  it('clears the mailing address field when hidden then shown', async () => {
    const user = userEvent.setup()

    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <ClaimantAddress />
      </Formik>
    )

    const residenceAddress = screen.getByRole('group', {
      name: 'label.primary_address',
    })
    const residenceStreetAddress = within(residenceAddress).getByLabelText(
      'address.address1.label'
    )
    const mailingAddressSame = screen.getByRole('checkbox', {
      name: 'label.mailing_address_same',
    })
    const mailingAddress = screen.getByRole('group', {
      name: 'label.mailing_address',
    })
    const mailingStreetAddress = within(mailingAddress).getByLabelText(
      'address.address1.label'
    )

    // Fill out some address information
    await user.type(residenceStreetAddress, '123 Somewhere')
    await user.type(mailingStreetAddress, '123 Somewhere Else')

    expect(residenceStreetAddress).toHaveValue('123 Somewhere')
    expect(mailingStreetAddress).toHaveValue('123 Somewhere Else')

    // Toggle mailing address off (mailing address is same)
    await user.click(mailingAddressSame)

    expect(mailingAddress).not.toBeInTheDocument()

    // Toggle mailing address on (mailing address is not same)
    await user.click(mailingAddressSame)

    const mailingAddressReturned = await screen.findByRole('group', {
      name: 'label.mailing_address',
    })
    const mailingStreetAddressReturned = within(
      mailingAddressReturned
    ).getByLabelText('address.address1.label')

    expect(mailingAddressReturned).toBeInTheDocument()
    expect(mailingStreetAddressReturned).toHaveValue('')
  })
})
