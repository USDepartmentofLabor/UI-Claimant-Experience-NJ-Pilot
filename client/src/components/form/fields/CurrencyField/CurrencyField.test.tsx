import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'

import { CurrencyField } from 'components/form/fields/CurrencyField/CurrencyField'
import { noop } from 'helpers/noop/noop'
import React from 'react'

describe('CurrencyField', () => {
  const FormikCurrencyField = () => {
    return (
      <Formik initialValues={{ myMoney: '' }} onSubmit={noop}>
        <CurrencyField name="myMoney" label="Show me the money" />
      </Formik>
    )
  }

  it('renders', () => {
    render(<FormikCurrencyField />)

    expect(
      screen.getByRole('textbox', { name: 'Show me the money' })
    ).toBeInTheDocument()
  })

  it('allows user to enter a number', async () => {
    render(<FormikCurrencyField />)
    const field = screen.getByRole('textbox', { name: 'Show me the money' })

    await userEvent.type(field, '32.54')

    expect(field).toHaveValue('32.54')
    await userEvent.clear(field)
    expect(field).toHaveValue('')
  })

  it('Converts an initialValue of cents to dollars in the field input', () => {
    render(
      <Formik initialValues={{ myMoney: '22045' }} onSubmit={noop}>
        <CurrencyField name="myMoney" label="Show me the money" />
      </Formik>
    )

    const field = screen.getByRole('textbox', { name: 'Show me the money' })

    expect(field).toHaveValue('220.45')
  })
  it('Prevents onInvalid default from showing default validation error', async () => {
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <CurrencyField label="Some Key" name="someKey" />
      </Formik>
    )

    const testField = screen.getByLabelText(/some key/i)
    const invalidEvent = createEvent.invalid(testField)
    fireEvent(testField, invalidEvent)
    expect(invalidEvent.defaultPrevented).toBeTruthy()
  })
})
