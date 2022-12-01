import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PaymentsReceivedDetail from './PaymentsReceivedDetail'
import { Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import { PayTypeOption } from 'constants/formOptions'

describe('PaymentsReceivedDetail component', () => {
  it('renders fields (including dates) as expected', () => {
    const props = {
      name: 'paid_time_off',
      label: 'Paid Time Off',
      description: 'I am your salvation',
      payType: 'vacation_sick_pto' as Exclude<PayTypeOption, 'none'>,
    }
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <PaymentsReceivedDetail {...props} />
      </Formik>
    )

    expect(
      screen.getByRole('textbox', {
        name: `payments_received.payments_received_detail.total.label`,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('group', {
        name: `payments_received.payments_received_detail.date_pay_began.label`,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('group', {
        name: `payments_received.payments_received_detail.date_pay_ended.label`,
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('textbox', {
        name: `payments_received.payments_received_detail.other_note.label`,
      })
    ).not.toBeInTheDocument()
  })

  it('user can type into fields', async () => {
    const props = {
      name: 'bonus',
      label: 'Bonus',
      payType: 'severance_or_continuation' as Exclude<PayTypeOption, 'none'>,
    }
    render(
      <Formik
        initialValues={{ total: '', date_pay_began: '', note: '' }}
        onSubmit={noop}
      >
        <PaymentsReceivedDetail {...props} />
      </Formik>
    )

    const startDateGroup = screen.getByRole('group', {
      name: 'payments_received.payments_received_detail.date_pay_began.label',
    })
    const monthField = within(startDateGroup).getByRole('textbox', {
      name: 'date.month.label',
    })
    const dayField = within(startDateGroup).getByRole('textbox', {
      name: 'date.day.label',
    })
    const yearField = within(startDateGroup).getByRole('textbox', {
      name: 'date.year.label',
    })

    const endDateGroup = screen.getByRole('group', {
      name: 'payments_received.payments_received_detail.date_pay_ended.label',
    })
    const endMonthField = within(endDateGroup).getByRole('textbox', {
      name: 'date.month.label',
    })
    const endDayField = within(endDateGroup).getByRole('textbox', {
      name: 'date.day.label',
    })
    const endYearField = within(endDateGroup).getByRole('textbox', {
      name: 'date.year.label',
    })

    await userEvent.clear(monthField)
    await userEvent.type(monthField, '08')
    await userEvent.clear(dayField)
    await userEvent.type(dayField, '15')
    await userEvent.clear(yearField)
    await userEvent.type(yearField, '2020')

    expect(monthField).toHaveValue('08')
    expect(dayField).toHaveValue('15')
    expect(yearField).toHaveValue('2020')

    await userEvent.clear(endMonthField)
    await userEvent.type(endMonthField, '10')
    await userEvent.clear(endDayField)
    await userEvent.type(endDayField, '22')
    await userEvent.clear(endYearField)
    await userEvent.type(endYearField, '2020')

    expect(endMonthField).toHaveValue('10')
    expect(endDayField).toHaveValue('22')
    expect(endYearField).toHaveValue('2020')
  })

  it('renders expected fields for other pay', async () => {
    const props = {
      name: 'something_else',
      label: 'Some other mysterious payment',
      payType: 'other_pay' as Exclude<PayTypeOption, 'none'>,
    }
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <PaymentsReceivedDetail {...props} />
      </Formik>
    )

    expect(
      screen.getByRole('textbox', {
        name: `payments_received.payments_received_detail.other_note.label`,
      })
    ).toBeInTheDocument()

    const noteField = screen.getByRole('textbox', {
      name: `payments_received.payments_received_detail.other_note.label`,
    })

    await userEvent.type(noteField, 'I did an extra favor')

    const startDateGroup = screen.queryByRole('group', {
      name: 'payments_received.payments_received_detail.date_pay_began.label',
    })
    const endDateGroup = screen.queryByRole('group', {
      name: 'payments_received.payments_received_detail.date_pay_ended.label',
    })

    expect(noteField).toHaveValue('I did an extra favor')
    expect(startDateGroup).not.toBeInTheDocument()
    expect(endDateGroup).not.toBeInTheDocument()
  })
})
