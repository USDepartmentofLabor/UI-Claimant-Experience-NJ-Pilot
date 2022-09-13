import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import Personal, { PersonalPageDefinition } from 'pages/claim/personal'
import { noop } from 'helpers/noop/noop'

describe('Personal information component', () => {
  const initialValues = {
    ...PersonalPageDefinition.initialValues,
    claimant_name: {
      first_name: 'Dori',
      middle_initial: 'D',
      last_name: 'Coxen',
    },
  }
  it('renders properly without error', () => {
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Personal />
      </Formik>
    )
    const verifiedFieldsSection = screen.getByTestId('verified-fields')
    const verifiedFields = within(verifiedFieldsSection).getAllByRole(
      'listitem'
    )
    const verifiedLegalName = within(verifiedFieldsSection).getByText(
      'personal.verified_legal_name.label'
    )

    const verifiedLegalNameValue = within(verifiedFieldsSection).getByText(
      'Dori D Coxen'
    )

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

    expect(verifiedFieldsSection).toBeInTheDocument()
    expect(verifiedFields).toHaveLength(1)
    expect(verifiedLegalName).toBeInTheDocument()
    expect(verifiedLegalNameValue).toBeInTheDocument()

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
