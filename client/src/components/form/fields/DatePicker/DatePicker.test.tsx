import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { render, screen } from '@testing-library/react'
import { DatePicker } from 'components/form/fields/DatePicker/DatePicker'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'

describe('DatePicker', () => {
  it('renders', () => {
    render(
      <Formik initialValues={{ myDate: undefined }} onSubmit={noop}>
        <DatePicker name="myDate" label="title" />
      </Formik>
    )
    const visibleDateField = screen.getByTestId('date-picker-external-input')
    expect(visibleDateField).toBeInstanceOf(HTMLInputElement)
    expect(visibleDateField).toHaveAttribute('id', 'myDate')

    const hiddenDateField = screen.getByTestId('date-picker-internal-input')
    expect(hiddenDateField).toHaveAttribute('name', 'myDate')
  })

  it('displays an error', async () => {
    render(
      <Formik
        initialValues={{ myDate: '' }}
        validationSchema={yup.object().shape({
          myDate: yup.string().required('You must enter a date'),
        })}
        onSubmit={noop}
      >
        {({ submitForm }) => {
          return (
            <>
              <DatePicker name="myDate" label="title" />
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
    expect(errorAlert).toHaveTextContent('You must enter a date')
  })
})
