import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'

import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { noop } from 'helpers/noop/noop'
import * as yup from 'yup'
import React from 'react'

const radioOptions = [
  {
    label: 'First',
    value: 'first',
  },
  {
    label: 'Second',
    value: 'second',
  },
  {
    label: 'Third',
    value: 'third',
  },
]

describe('RadioField component', () => {
  it('renders the elements that make up a field', () => {
    render(
      <Formik initialValues={{ radioField: undefined }} onSubmit={noop}>
        <RadioField name="radioField" options={radioOptions} />
      </Formik>
    )

    const firstOption = screen.getByLabelText('First')
    const secondOption = screen.getByLabelText('Second')
    const thirdOption = screen.getByLabelText('Third')

    expect(firstOption).toBeInstanceOf(HTMLInputElement)
    expect(firstOption).toHaveAttribute('id', 'radioField.first')
    expect(firstOption).toHaveAttribute('name', 'radioField')
    expect(firstOption).toHaveAttribute('value', 'first')

    expect(secondOption).toBeInstanceOf(HTMLInputElement)
    expect(secondOption).toHaveAttribute('id', 'radioField.second')
    expect(secondOption).toHaveAttribute('name', 'radioField')
    expect(secondOption).toHaveAttribute('value', 'second')

    expect(thirdOption).toBeInstanceOf(HTMLInputElement)
    expect(thirdOption).toHaveAttribute('id', 'radioField.third')
    expect(thirdOption).toHaveAttribute('name', 'radioField')
    expect(thirdOption).toHaveAttribute('value', 'third')
  })

  describe('uses initial values', () => {
    it('uses the initial value that is passed', () => {
      render(
        <Formik initialValues={{ radioField: 'second' }} onSubmit={noop}>
          <RadioField name="radioField" options={radioOptions} />
        </Formik>
      )

      const firstOption = screen.getByLabelText('First')
      const secondOption = screen.getByLabelText('Second')
      const thirdOption = screen.getByLabelText('Third')

      expect(firstOption).not.toBeChecked()
      expect(secondOption).toBeChecked()
      expect(thirdOption).not.toBeChecked()
    })
  })

  describe('disabled', () => {
    it('disables the RadioField when it is disabled', () => {
      render(
        <Formik initialValues={{ radioField: 'second' }} onSubmit={noop}>
          <RadioField name="radioField" options={radioOptions} disabled />
        </Formik>
      )

      screen
        .queryAllByRole('radio')
        .map((radioOption) => expect(radioOption).toBeDisabled())
    })

    /**
     *  We don't currently have this use case, but it seems common enough that we
     *  should add it as necessary. This TODO should serve as a reminder that the
     *  functionality does not exist at the moment.
     *  Likely allow props specific to an option, like `disabled`, to be passed
     *  via IRadioOption when defining the options.
     */
    it.todo('is possible to disable a subset of radio options')
  })

  describe('user interaction', () => {
    it('allows the user to make a single selection', async () => {
      render(
        <Formik initialValues={{ radioField: undefined }} onSubmit={noop}>
          <RadioField name="radioField" options={radioOptions} />
        </Formik>
      )

      const firstOption = screen.getByLabelText('First')
      const secondOption = screen.getByLabelText('Second')
      const thirdOption = screen.getByLabelText('Third')

      // Initially undefined, no radio should be selected
      expect(firstOption).not.toBeChecked()
      expect(secondOption).not.toBeChecked()
      expect(thirdOption).not.toBeChecked()

      // Select an option
      await userEvent.click(thirdOption)

      // Only that option should be checked
      expect(firstOption).not.toBeChecked()
      expect(secondOption).not.toBeChecked()
      expect(thirdOption).toBeChecked()

      // Select a different option
      await userEvent.click(firstOption)

      // Only that option should be checked
      expect(firstOption).toBeChecked()
      expect(secondOption).not.toBeChecked()
      expect(thirdOption).not.toBeChecked()
    })

    it('fires custom onChange', async () => {
      const onChange = jest.fn()
      render(
        <Formik initialValues={{ radioField: undefined }} onSubmit={noop}>
          <RadioField
            name="radioField"
            options={radioOptions}
            onChange={onChange}
          />
        </Formik>
      )

      const firstOption = screen.getByLabelText('First')
      const thirdOption = screen.getByLabelText('Third')

      // Select an option
      await userEvent.click(thirdOption)

      // onChange should file
      expect(thirdOption).toBeChecked()
      expect(onChange).toHaveBeenCalledTimes(1)

      // Select a different option
      await userEvent.click(firstOption)

      // onChange should be called a second time
      expect(firstOption).toBeChecked()
      expect(onChange).toHaveBeenCalledTimes(2)
    })

    it('Displays an error', async () => {
      render(
        <Formik
          initialValues={{ radioField: '' }}
          validationSchema={yup.object().shape({
            radioField: yup.boolean().required('You must select an option'),
          })}
          onSubmit={noop}
        >
          {({ submitForm }) => {
            return (
              <>
                <RadioField name="radioField" options={radioOptions} />
                <button type="submit" onClick={submitForm}>
                  Submit
                </button>
              </>
            )
          }}
        </Formik>
      )
      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await userEvent.click(submitButton)

      const errorAlert = await screen.findByRole('alert')

      expect(errorAlert).toBeInTheDocument()
      expect(errorAlert).toHaveTextContent('You must select an option')
    })
  })
})
