import { render, screen } from '@testing-library/react'
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

    expect(
      screen.getByRole('textbox', { name: 'name.first_name.label' })
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('textbox', { name: 'address.address1.label' })[0]
    ).toBeInTheDocument()
  })
})
