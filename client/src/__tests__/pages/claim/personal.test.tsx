import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import Personal, { PersonalPageDefinition } from 'pages/claim/personal'
import { noop } from 'helpers/noop/noop'

describe('Personal information component', () => {
  const initialValues = PersonalPageDefinition.initialValues
  it('renders properly without error', () => {
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Personal />
      </Formik>
    )

    const claimantName = screen.queryByRole('group', {
      name: 'legal_name',
    })
    const hasAlternateNamesQuestion = screen.getByRole('group', {
      name: 'claimant_has_alternate_names.label',
    })
    const yesAlternateNames = within(hasAlternateNamesQuestion).queryByRole(
      'radio',
      {
        name: 'yes',
      }
    )
    const noAlternateNames = within(hasAlternateNamesQuestion).queryByRole(
      'radio',
      {
        name: 'no',
      }
    )
    const claimantAlternateNames = screen.queryByRole('group', {
      name: 'alternate_name',
    })

    const primaryAddress = screen.getByRole('group', {
      name: 'label.primary_address',
    })
    const mailingAddressIsSameCheckbox = screen.getByRole('checkbox', {
      name: 'label.mailing_address_same',
    })
    const mailingAddress = screen.getByRole('group', {
      name: 'label.mailing_address',
    })

    expect(claimantName).toBeInTheDocument()
    expect(yesAlternateNames).toBeInTheDocument()
    expect(yesAlternateNames).not.toBeChecked()
    expect(noAlternateNames).toBeInTheDocument()
    expect(noAlternateNames).not.toBeChecked()
    expect(claimantAlternateNames).not.toBeInTheDocument()

    expect(primaryAddress).toBeInTheDocument()
    expect(mailingAddressIsSameCheckbox).toBeInTheDocument()
    expect(mailingAddress).toBeInTheDocument()
  })
})
