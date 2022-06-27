import { render, within, screen } from '@testing-library/react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import userEvent from '@testing-library/user-event'
import { yupDate } from 'validations/yup/custom'
import { noop } from 'helpers/noop/noop'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
}))

describe('DateInputField Component', () => {
  const { t } = useTranslation('claimForm')
  const submittableDateInputField = (
    <Formik
      initialValues={{ dateInputField: '' }}
      validationSchema={yup.object().shape({
        dateInputField: yupDate(t, 'a test date'),
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

    expect(monthField).toHaveValue('01')
    expect(dayField).toHaveValue('13')
    expect(yearField).toHaveValue('1885')
  })

  it('Displays an error', async () => {
    const { getByLabelText, findByRole } = render(submittableDateInputField)

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    // validate the form
    await userEvent.click(screen.getByRole('button'))
    expect(await findByRole('alert')).toBeInTheDocument()
  })

  it('Allows the user to enter a date', async () => {
    const { getByLabelText, queryByRole } = render(submittableDateInputField)

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    // Focus the month input and type a month
    await userEvent.type(monthField, '01')
    expect(monthField).toHaveFocus()
    expect(monthField).toHaveValue('01')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // tab to day field
    await userEvent.tab()
    expect(dayField).toHaveFocus()

    // Continue typing a day since the day input has focus
    await userEvent.keyboard('02')
    expect(dayField).toHaveFocus()
    expect(dayField).toHaveValue('02')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // tab to year field
    await userEvent.tab()
    expect(yearField).toHaveFocus()

    // continue typing a year since the year field has focus
    await userEvent.keyboard('2000')
    expect(yearField).toHaveFocus()
    expect(yearField).toHaveValue('2000')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // Tab away from the year field, blurs the entire field.
    await userEvent.tab()

    expect(monthField).not.toHaveFocus()
    expect(dayField).not.toHaveFocus()
    expect(yearField).not.toHaveFocus()

    expect(monthField).toHaveValue('01')
    expect(dayField).toHaveValue('02')
    expect(yearField).toHaveValue('2000')

    // validate the form, no errors should be present
    await userEvent.click(screen.getByRole('button'))
    expect(queryByRole('alert')).not.toBeInTheDocument()
  })

  it('Allows the user to enter a date with single digit month and day', async () => {
    const { getByLabelText, queryByRole } = render(submittableDateInputField)

    const monthField = getByLabelText('date.month.label')
    const dayField = getByLabelText('date.day.label')
    const yearField = getByLabelText('date.year.label')

    // Focus the month input and type a month
    await userEvent.type(monthField, '1')

    expect(monthField).toHaveFocus()
    expect(monthField).toHaveValue('1')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // tab to day field
    await userEvent.tab()

    expect(dayField).toHaveFocus()

    // Continue typing a day since the day input has focus
    await userEvent.keyboard('2')

    expect(dayField).toHaveFocus()
    expect(dayField).toHaveValue('2')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // tab to year field
    await userEvent.tab()

    expect(yearField).toHaveFocus()

    // continue typing a year since the year field has focus
    await userEvent.keyboard('2000')

    expect(yearField).toHaveFocus()
    expect(yearField).toHaveValue('2000')
    expect(queryByRole('alert')).not.toBeInTheDocument()

    // Tab away from the year field, blurs the entire field. No Error should be present
    await userEvent.tab()

    expect(monthField).not.toHaveFocus()
    expect(dayField).not.toHaveFocus()
    expect(yearField).not.toHaveFocus()

    expect(monthField).toHaveValue('1')
    expect(dayField).toHaveValue('2')
    expect(yearField).toHaveValue('2000')

    // validate the form, no errors should be present
    await userEvent.click(screen.getByRole('button'))

    expect(queryByRole('alert')).not.toBeInTheDocument()
  })

  it('Allows the user erase a date', async () => {
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
    await userEvent.type(monthField, '01')
    await userEvent.type(dayField, '02')
    await userEvent.type(yearField, '2000')

    expect(yearField).toHaveFocus()
    expect(monthField).toHaveValue('01')
    expect(dayField).toHaveValue('02')
    expect(yearField).toHaveValue('2000')

    // Erase the year
    await userEvent.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}')
    expect(yearField).toHaveFocus()
    expect(yearField).toHaveValue('')

    // Shift tab to move backwards to the day field
    await userEvent.tab({ shift: true })
    expect(dayField).toHaveFocus()
    expect(dayField).toHaveValue('02')

    // Erase the day field
    await userEvent.keyboard('{Backspace}{Backspace}')
    expect(dayField).toHaveFocus()
    expect(dayField).toHaveValue('')

    // Shift tab to move backwards to the month field
    await userEvent.tab({ shift: true })
    expect(monthField).toHaveFocus()
    expect(monthField).toHaveValue('01')

    // Erase the rest of the month field, leaving the entire date erased
    await userEvent.keyboard('{Backspace}{Backspace}')
    expect(monthField).toHaveFocus()
    expect(monthField).toHaveValue('')
    expect(dayField).toHaveValue('')
    expect(yearField).toHaveValue('')
  })
})
