import {
  render,
  within,
  screen,
  createEvent,
  fireEvent,
} from '@testing-library/react'
import { Formik } from 'formik'
import * as yup from 'yup'
import userEvent from '@testing-library/user-event'
import { yupDate } from 'validations/yup/custom'
import { noop } from 'helpers/noop/noop'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import React from 'react'

describe('DateInputField Component', () => {
  const submittableDateInputField = (
    <Formik
      initialValues={{ dateInputField: '' }}
      validationSchema={yup.object().shape({
        dateInputField: yupDate('a test date').required('Date is required'),
      })}
      onSubmit={noop}
    >
      {({ submitForm }) => {
        return (
          <>
            <DateInputField name="dateInputField" />
            <button type="submit" onClick={submitForm}>
              Submit
            </button>
          </>
        )
      }}
    </Formik>
  )

  it('renders the elements that make up the field', () => {
    const { getByLabelText } = render(
      <Formik initialValues={{ dateInputField: '' }} onSubmit={noop}>
        <DateInputField name="dateInputField" />
      </Formik>
    )

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    expect(monthField).toBeInstanceOf(HTMLInputElement)
    expect(monthField).toHaveAttribute('id', 'dateInputField.month')
    expect(monthField).toHaveAttribute('name', 'dateInputField.month')
    expect(monthField).toHaveValue('')

    expect(dayField).toBeInstanceOf(HTMLInputElement)
    expect(dayField).toHaveAttribute('id', 'dateInputField.day')
    expect(dayField).toHaveAttribute('name', 'dateInputField.day')
    expect(dayField).toHaveValue('')

    expect(yearField).toBeInstanceOf(HTMLInputElement)
    expect(yearField).toHaveAttribute('id', 'dateInputField.year')
    expect(yearField).toHaveAttribute('name', 'dateInputField.year')
    expect(yearField).toHaveValue('')
  })

  it('Renders a label', () => {
    const { getByRole } = render(
      <Formik initialValues={{ dateInputField: '' }} onSubmit={noop}>
        <DateInputField name="dateInputField" legend={'legend'} />
      </Formik>
    )

    const fieldset = getByRole('group', { name: 'legend' })
    const monthField = within(fieldset).getByLabelText('date.month.label')
    const dayField = within(fieldset).getByLabelText('date.day.label')
    const yearField = within(fieldset).getByLabelText('date.year.label')

    expect(fieldset).toBeInTheDocument()
    expect(fieldset).toBeInstanceOf(HTMLFieldSetElement)
    expect(monthField).toBeInTheDocument()
    expect(dayField).toBeInTheDocument()
    expect(yearField).toBeInTheDocument()
  })

  it('renders a hint', () => {
    const { queryByText } = render(
      <Formik initialValues={{ dateInputField: '' }} onSubmit={noop}>
        <DateInputField name={'dateInputField'} hint="Here's a clue!" />
      </Formik>
    )

    const hint = queryByText("Here's a clue!")

    expect(hint).toBeInTheDocument()
    expect(hint).toHaveClass('usa-hint')
  })

  it('accepts and parses an initial value properly', () => {
    const { getByLabelText } = render(
      <Formik initialValues={{ dateInputField: '1885-01-13' }} onSubmit={noop}>
        <DateInputField name={'dateInputField'} />
      </Formik>
    )

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    expect(monthField).toHaveValue('1')
    expect(dayField).toHaveValue('13')
    expect(yearField).toHaveValue('1885')
  })

  it('accepts and parses an undefined initial value properly', () => {
    const { getByLabelText } = render(
      <Formik initialValues={{ dateInputField: undefined }} onSubmit={noop}>
        <DateInputField name={'dateInputField'} />
      </Formik>
    )

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    expect(monthField).toHaveValue('')
    expect(dayField).toHaveValue('')
    expect(yearField).toHaveValue('')
  })

  it.each([
    ['-01-02', { month: '1', day: '2', year: '' }],
    ['2000--02', { month: '', day: '2', year: '2000' }],
    ['2000-01-', { month: '1', day: '', year: '2000' }],
  ])(
    'parses partially complete initial values properly',
    (value, expectedParts) => {
      const { getByLabelText } = render(
        <Formik initialValues={{ dateInputField: value }} onSubmit={noop}>
          <DateInputField name={'dateInputField'} />
        </Formik>
      )

      const monthField = getByLabelText('date.month.label')
      const dayField = getByLabelText('date.day.label')
      const yearField = getByLabelText('date.year.label')

      expect(monthField).toHaveValue(expectedParts.month)
      expect(dayField).toHaveValue(expectedParts.day)
      expect(yearField).toHaveValue(expectedParts.year)
    }
  )

  it('Displays an error', async () => {
    const user = userEvent.setup()
    const { findByRole } = render(submittableDateInputField)

    // validate the form
    await user.click(screen.getByRole('button'))
    expect(await findByRole('alert')).toBeInTheDocument()
  })

  it('Allows the user to enter a date', async () => {
    const user = userEvent.setup()
    const { getByLabelText, queryByRole } = render(submittableDateInputField)

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    // Focus the month input and type a month
    await user.type(monthField, '01')
    expect(monthField).toHaveFocus()
    expect(monthField).toHaveValue('01')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // tab to day field
    await user.tab()
    expect(dayField).toHaveFocus()

    // Continue typing a day since the day input has focus
    await user.keyboard('02')
    expect(dayField).toHaveFocus()
    expect(dayField).toHaveValue('02')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // tab to year field
    await user.tab()
    expect(yearField).toHaveFocus()

    // continue typing a year since the year field has focus
    await user.keyboard('2000')
    expect(yearField).toHaveFocus()
    expect(yearField).toHaveValue('2000')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // Tab away from the year field, blurs the entire field.
    await user.tab()

    expect(monthField).not.toHaveFocus()
    expect(dayField).not.toHaveFocus()
    expect(yearField).not.toHaveFocus()

    expect(monthField).toHaveValue('01')
    expect(dayField).toHaveValue('02')
    expect(yearField).toHaveValue('2000')

    // validate the form, no errors should be present
    await user.click(screen.getByRole('button'))
    expect(queryByRole('alert')).not.toBeInTheDocument()
  })

  it('Passes through custom onChange handlers for each input', async () => {
    const user = userEvent.setup()

    const monthOnChange = jest.fn()
    const dayOnChange = jest.fn()
    const yearOnChange = jest.fn()

    render(
      <Formik initialValues={{ dateInputField: '' }} onSubmit={noop}>
        <DateInputField
          name="dateInputField"
          monthProps={{ onChange: monthOnChange }}
          dayProps={{ onChange: dayOnChange }}
          yearProps={{ onChange: yearOnChange }}
        />
      </Formik>
    )

    const monthField = screen.getByLabelText('date.month.label')
    const dayField = screen.getByLabelText('date.day.label')
    const yearField = screen.getByLabelText('date.year.label')

    await user.type(monthField, '1')
    expect(monthOnChange).toHaveBeenCalledTimes(1)

    await user.type(dayField, '1')
    expect(dayOnChange).toHaveBeenCalledTimes(1)

    await user.type(yearField, '1')
    expect(yearOnChange).toHaveBeenCalledTimes(1)
  })

  it('Prevents non-numeric inputs', async () => {
    const user = userEvent.setup()

    const monthOnChange = jest.fn()
    const dayOnChange = jest.fn()
    const yearOnChange = jest.fn()

    render(
      <Formik initialValues={{ dateInputField: '' }} onSubmit={noop}>
        <DateInputField
          name="dateInputField"
          monthProps={{ onChange: monthOnChange }}
          dayProps={{ onChange: dayOnChange }}
          yearProps={{ onChange: yearOnChange }}
        />
      </Formik>
    )

    const monthField = screen.getByLabelText('date.month.label')
    const dayField = screen.getByLabelText('date.day.label')
    const yearField = screen.getByLabelText('date.year.label')

    await user.type(monthField, 'a')
    expect(monthField).toHaveValue('')
    expect(monthOnChange).toHaveBeenCalledTimes(0)

    await user.type(dayField, 'b')
    expect(dayField).toHaveValue('')
    expect(dayOnChange).toHaveBeenCalledTimes(0)

    await user.type(yearField, 'c')
    expect(dayField).toHaveValue('')
    expect(yearOnChange).toHaveBeenCalledTimes(0)
  })

  it('Allows the user to enter a date with single digit month and day', async () => {
    const user = userEvent.setup()
    const { getByLabelText, queryByRole } = render(submittableDateInputField)

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    // Focus the month input and type a month
    await user.type(monthField, '1')

    expect(monthField).toHaveFocus()
    expect(monthField).toHaveValue('1')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // tab to day field
    await user.tab()

    expect(dayField).toHaveFocus()

    // Continue typing a day since the day input has focus
    await user.keyboard('2')

    expect(dayField).toHaveFocus()
    expect(dayField).toHaveValue('2')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // tab to year field
    await user.tab()

    expect(yearField).toHaveFocus()

    // continue typing a year since the year field has focus
    await user.keyboard('2000')

    expect(yearField).toHaveFocus()
    expect(yearField).toHaveValue('2000')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // Tab away from the year field, blurs the entire field. No Error should be present
    await user.tab()

    expect(monthField).not.toHaveFocus()
    expect(dayField).not.toHaveFocus()
    expect(yearField).not.toHaveFocus()

    expect(monthField).toHaveValue('1')
    expect(dayField).toHaveValue('2')
    expect(yearField).toHaveValue('2000')

    // validate the form, no errors should be present
    await user.click(screen.getByRole('button'))

    expect(queryByRole('alert')).not.toBeInTheDocument()
  })

  it('Allows the user erase a date', async () => {
    const user = userEvent.setup()
    const { getByLabelText } = render(
      <Formik
        initialValues={{ dateInputField: '' }}
        validationSchema={yup.object().shape({
          dateInputField: yup.date().required(),
        })}
        onSubmit={noop}
      >
        <DateInputField name={'dateInputField'} />
      </Formik>
    )

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    // Enter a date by typing in the field:
    await user.type(monthField, '01')
    await user.type(dayField, '02')
    await user.type(yearField, '2000')

    expect(yearField).toHaveFocus()
    expect(monthField).toHaveValue('01')
    expect(dayField).toHaveValue('02')
    expect(yearField).toHaveValue('2000')

    // Erase the year
    await user.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}')
    expect(yearField).toHaveFocus()
    expect(yearField).toHaveValue('')

    // Shift tab to move backwards to the day field
    await user.tab({ shift: true })
    expect(dayField).toHaveFocus()
    expect(dayField).toHaveValue('02')

    // Erase the day field
    await user.keyboard('{Backspace}{Backspace}')
    expect(dayField).toHaveFocus()
    expect(dayField).toHaveValue('')

    // Shift tab to move backwards to the month field
    await user.tab({ shift: true })
    expect(monthField).toHaveFocus()
    expect(monthField).toHaveValue('01')

    // Erase the rest of the month field, leaving the entire date erased
    await user.keyboard('{Backspace}{Backspace}')
    expect(monthField).toHaveFocus()
    expect(monthField).toHaveValue('')
    expect(dayField).toHaveValue('')
    expect(yearField).toHaveValue('')
  })
  it('Prevents onInvalid default from showing default validation error', async () => {
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <DateInputField name="someDate" />
      </Formik>
    )

    for (const label of [
      'date.month.label',
      'date.day.label',
      'date.year.label',
    ]) {
      const testField = screen.getByLabelText(label)
      const invalidEvent = createEvent.invalid(testField)
      fireEvent(testField, invalidEvent)
      expect(invalidEvent.defaultPrevented).toBeTruthy()
    }
  })
  it('Prefers to display dates without leading zeroes in month and day fields', async () => {
    const user = userEvent.setup()

    render(
      <Formik initialValues={{ someDate: '2003-02-01' }} onSubmit={noop}>
        {({ setFieldValue }) => (
          <>
            <DateInputField name="someDate" />
            <button
              onClick={async () => {
                await setFieldValue('someDate', '2004-03-02')
              }}
            >
              Update Value
            </button>
          </>
        )}
      </Formik>
    )

    const monthField = screen.getByLabelText('date.month.label')
    const dayField = screen.getByLabelText('date.day.label')
    const yearField = screen.getByLabelText('date.year.label')
    const updateButton = screen.getByRole('button')

    expect(monthField).toHaveValue('2')
    expect(dayField).toHaveValue('1')
    expect(yearField).toHaveValue('2003')

    await user.click(updateButton)

    expect(monthField).toHaveValue('3')
    expect(dayField).toHaveValue('2')
    expect(yearField).toHaveValue('2004')
  })
})
