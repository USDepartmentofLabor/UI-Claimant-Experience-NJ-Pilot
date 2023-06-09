import { act, render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import * as yup from 'yup'
import userEvent from '@testing-library/user-event'

import { Name } from './Name'
import { noop } from 'helpers/noop/noop'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

describe('Name component', () => {
  it('renders inputs for first, middle, and last names', () => {
    const claimantName = 'claimant_name'
    const initialValues = {
      [claimantName]: {
        first_name: '',
        middle_initial: '',
        last_name: '',
      },
    }

    const { getByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Name name={claimantName} />
      </Formik>
    )

    const firstNameField = getByLabelText('name.first_name.label')
    const middleNameField = getByLabelText('name.middle_initial.label')
    const lastNameField = getByLabelText('name.last_name.label')
    const suffixField = getByLabelText('name.suffix.label')

    expect(firstNameField).toHaveValue('')
    expect(firstNameField).toHaveAttribute('id', `${claimantName}.first_name`)
    expect(firstNameField).toHaveAttribute('name', `${claimantName}.first_name`)

    expect(middleNameField).toHaveValue('')
    expect(middleNameField).toHaveAttribute(
      'id',
      `${claimantName}.middle_initial`
    )
    expect(middleNameField).toHaveAttribute(
      'name',
      `${claimantName}.middle_initial`
    )

    expect(lastNameField).toHaveValue('')
    expect(lastNameField).toHaveAttribute('id', `${claimantName}.last_name`)
    expect(lastNameField).toHaveAttribute('name', `${claimantName}.last_name`)

    expect(suffixField).toHaveValue('')
    expect(suffixField).toHaveAttribute('id', `${claimantName}.suffix`)
    expect(suffixField).toHaveAttribute('name', `${claimantName}.suffix`)
  })

  it('accepts initial values passed in', () => {
    const claimantName = 'claimant_name'
    const initialValues = {
      [claimantName]: {
        first_name: 'Ima',
        middle_initial: 'D',
        last_name: 'Claimant',
        suffix: 'junior',
      },
    }

    const { getByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Name name={claimantName} />
      </Formik>
    )

    const firstNameField = getByLabelText('name.first_name.label')
    const middleNameField = getByLabelText('name.middle_initial.label')
    const lastNameField = getByLabelText('name.last_name.label')
    const suffixField = getByLabelText('name.suffix.label')

    expect(firstNameField).toHaveValue('Ima')
    expect(middleNameField).toHaveValue('D')
    expect(lastNameField).toHaveValue('Claimant')
    expect(suffixField).toHaveValue('junior')
  })

  it('accepts a validation schema passed in', async () => {
    const user = userEvent.setup()
    const claimantName = 'claimant_name'
    const initialValues = {
      [claimantName]: {
        first_name: '',
        middle_initial: '',
        last_name: '',
      },
    }

    const validationSchema = yup.object().shape({
      [claimantName]: yup.object().shape({
        first_name: yup.string().required('First Name is required'),
        middle_initial: yup.string().optional(),
        last_name: yup.string().required('Last Name is required'),
        suffix: yup.string().optional(),
      }),
    })

    const { getByLabelText, queryByText } = render(
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={noop}
      >
        {({ submitForm }) => (
          <>
            <Name name={claimantName} />
            <button onClick={submitForm}>Submit</button>
          </>
        )}
      </Formik>
    )

    const firstNameField = getByLabelText('name.first_name.label')
    const lastNameField = getByLabelText('name.last_name.label')

    expect(firstNameField).toHaveValue('')
    expect(queryByText('First Name is required')).not.toBeInTheDocument()
    expect(lastNameField).toHaveValue('')
    expect(queryByText('Last Name is required')).not.toBeInTheDocument()

    await act(async () => {
      user.click(firstNameField)
      lastNameField.blur()
      user.click(lastNameField)
      lastNameField.blur()
    })

    // Don't validate on blur before submit
    expect(queryByText('First Name is required')).not.toBeInTheDocument()
    expect(queryByText('Last Name is required')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button'))

    expect(queryByText('First Name is required')).toBeInTheDocument()
    expect(queryByText('Last Name is required')).toBeInTheDocument()
  })
})
