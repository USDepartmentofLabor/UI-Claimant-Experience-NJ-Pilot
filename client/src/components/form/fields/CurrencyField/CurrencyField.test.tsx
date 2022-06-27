import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'

import CurrencyField from 'components/form/fields/CurrencyField/CurrencyField'
import { noop } from 'helpers/noop/noop'

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

  it('fires a custom onChange event handler', async () => {
    const mockOnChange = jest.fn()
    render(
      <Formik initialValues={{ myMoney: '' }} onSubmit={noop}>
        <CurrencyField
          name="myMoney"
          label="Show me the money"
          onChange={mockOnChange}
        />
      </Formik>
    )

    const field = screen.getByRole('textbox', { name: 'Show me the money' })

    await userEvent.type(field, '1')

    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(field).toHaveValue('1')

    await userEvent.type(field, '{Backspace}')

    expect(mockOnChange).toHaveBeenCalledTimes(2)
    expect(field).toHaveValue('')
  })
})
