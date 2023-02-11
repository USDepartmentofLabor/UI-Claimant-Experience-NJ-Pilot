import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'

import { noop } from 'helpers/noop/noop'
import PaymentsReceived from 'components/form/employer/PaymentsReceived/PaymentsReceived'

describe('PaymentsReceived', () => {
  const defaultInitialValues = { payments_received: [] }
  const renderPaymentsReceived = async (
    initialValues: object = defaultInitialValues
  ) => {
    await act(() =>
      render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <PaymentsReceived />
        </Formik>
      )
    )
    const payTypeGroup = screen.getByRole('group', {
      name: 'payments_received.payments_received_detail.pay_type.label',
    })

    return {
      user: userEvent.setup(),
      payTypeGroup,
      pto: within(payTypeGroup).getByText(
        'payments_received.payments_received_detail.pay_type.options.vacation_sick_pto.label'
      ),
      otherPay: within(payTypeGroup).getByText(
        'payments_received.payments_received_detail.pay_type.options.other_pay.label'
      ),
      vacation: within(payTypeGroup).getByRole('checkbox', {
        name: 'payments_received.payments_received_detail.pay_type.options.vacation_sick_pto.label payments_received.payments_received_detail.pay_type.options.vacation_sick_pto.description',
      }),
      severance: within(payTypeGroup).getByRole('checkbox', {
        name: 'payments_received.payments_received_detail.pay_type.options.severance.label payments_received.payments_received_detail.pay_type.options.severance.description',
      }),
      continuation: within(payTypeGroup).getByRole('checkbox', {
        name: 'payments_received.payments_received_detail.pay_type.options.continuation.label payments_received.payments_received_detail.pay_type.options.continuation.description',
      }),
      payment_in_lieu_of_notice: within(payTypeGroup).getByRole('checkbox', {
        name: 'payments_received.payments_received_detail.pay_type.options.payment_in_lieu_of_notice.label payments_received.payments_received_detail.pay_type.options.payment_in_lieu_of_notice.description',
      }),
      holiday: within(payTypeGroup).getByRole('checkbox', {
        name: 'payments_received.payments_received_detail.pay_type.options.holiday.label payments_received.payments_received_detail.pay_type.options.holiday.description',
      }),
      noOtherPay: within(payTypeGroup).getByText(
        'payments_received.payments_received_detail.pay_type.options.none.label'
      ),
      getOtherPayNoteField: () =>
        screen.getByRole('textbox', {
          name: 'payments_received.payments_received_detail.other_note.label',
        }),
      queryOtherPayNoteField: () =>
        screen.queryByRole('textbox', {
          name: 'payments_received.payments_received_detail.other_note.label',
        }),
    }
  }
  it('renders properly', async () => {
    await renderPaymentsReceived()
    expect(
      screen.getByRole('group', {
        name: 'payments_received.payments_received_detail.pay_type.label',
      })
    ).toBeInTheDocument()
  })

  it('opens additional fields based on pay type selection', async () => {
    const { user, pto, otherPay, getOtherPayNoteField } =
      await renderPaymentsReceived()

    await user.click(pto)
    await user.click(otherPay)

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'payments_received.payments_received_detail.pay_type.options.vacation_sick_pto.label',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'payments_received.payments_received_detail.pay_type.options.other_pay.label',
      })
    ).toBeInTheDocument()

    // input is given a value
    await user.type(getOtherPayNoteField(), 'hello world')
    expect(getOtherPayNoteField()).toHaveValue('hello world')

    // unchecking pay type removes the pay detail fields
    await user.click(otherPay)
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'payments_received.payments_received_detail.pay_type.options.vacation_sick_pto.label',
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: 'payments_received.payments_received_detail.pay_type.options.other_pay.label',
      })
    ).not.toBeInTheDocument()

    // field value should be cleared when clicking again
    await user.click(otherPay)
    const otherPayNoteFieldAgain = screen.getByRole('textbox', {
      name: 'payments_received.payments_received_detail.other_note.label',
    })
    expect(otherPayNoteFieldAgain).toHaveValue('')
  })

  it("removes and disables all other options when 'no other pay' is selected", async () => {
    const initialValues = {
      payments_received: [
        {
          pay_type: 'vacation_sick_pto',
          total: 3000,
        },
        {
          pay_type: 'severance',
          total: 500,
          note: 'They paid a small severance',
        },
      ],
    }

    const { user, vacation, severance, noOtherPay } =
      await renderPaymentsReceived(initialValues)

    expect(vacation).toBeEnabled()
    expect(severance).toBeEnabled()

    await user.click(noOtherPay)

    expect(vacation).toBeDisabled()
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: 'payments_received.payments_received_detail.pay_type.options.vacation_sick_pto.label',
      })
    ).not.toBeInTheDocument()
    expect(severance).toBeDisabled()
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: 'payments_received.payments_received_detail.pay_type.options.severance_or_continuation.label',
      })
    ).not.toBeInTheDocument()
  })

  it('orders the order pay detail fields by order of checkboxes', async () => {
    const { user, pto, severance, otherPay } = await renderPaymentsReceived()

    await user.click(severance)
    await user.click(pto)
    await user.click(otherPay)

    const payDetails = screen.getAllByRole('heading', { level: 3 })
    expect(payDetails).toHaveLength(3)
    expect(payDetails[0]).toHaveTextContent('vacation_sick_pto')
    expect(payDetails[1]).toHaveTextContent('severance')
    expect(payDetails[2]).toHaveTextContent('other_pay')
  })

  it('displays the correct values in the details when pay types are removed', async () => {
    const { user, holiday, severance, continuation } =
      await renderPaymentsReceived()

    await user.click(holiday)
    await user.click(severance)
    await user.click(continuation)

    const holidayDetails = screen.getByTestId('payDetail-payments_received.0')
    const holidayTotal = within(holidayDetails).getByRole('textbox', {
      name: 'payments_received.payments_received_detail.total.label',
    })

    const holidayStartDateGroup = within(holidayDetails).getByRole('group', {
      name: 'payments_received.payments_received_detail.date_pay_began.label',
    })
    const holidayStartMonthField = within(holidayStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.month.label',
      }
    )
    const holidayStartDayField = within(holidayStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.day.label',
      }
    )
    const holidayStartYearField = within(holidayStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.year.label',
      }
    )

    const severanceDetails = screen.getByTestId('payDetail-payments_received.1')
    let severanceTotal = within(severanceDetails).getByRole('textbox', {
      name: 'payments_received.payments_received_detail.total.label',
    })

    const severanceDetailsQuery = within(severanceDetails).queryByRole(
      'group',
      {
        name: 'payments_received.payments_received_detail.date_pay_began.label',
      }
    )

    const continuationDetails = screen.getByTestId(
      'payDetail-payments_received.2'
    )
    const continuationTotal = within(continuationDetails).getByRole('textbox', {
      name: 'payments_received.payments_received_detail.total.label',
    })

    let continuationStartDateGroup = within(continuationDetails).getByRole(
      'group',
      {
        name: 'payments_received.payments_received_detail.date_pay_began.label',
      }
    )
    let continuationStartMonthField = within(
      continuationStartDateGroup
    ).getByRole('textbox', {
      name: 'date.month.label',
    })
    let continuationStartDayField = within(
      continuationStartDateGroup
    ).getByRole('textbox', {
      name: 'date.day.label',
    })
    let continuationStartYearField = within(
      continuationStartDateGroup
    ).getByRole('textbox', {
      name: 'date.year.label',
    })

    const [holidayValues, severanceValues, continuationValues] = [
      { total: '333', startMonth: '08', startDay: '20', startYear: '2022' },
      { total: '666' },
      { total: '999', startMonth: '09', startDay: '14', startYear: '2021' },
    ]

    await user.type(holidayTotal, holidayValues.total)
    await user.type(holidayStartMonthField, holidayValues.startMonth)
    await user.type(holidayStartDayField, holidayValues.startDay)
    await user.type(holidayStartYearField, holidayValues.startYear)

    expect(holidayTotal).toHaveValue(holidayValues.total)
    expect(holidayStartMonthField).toHaveValue(holidayValues.startMonth)
    expect(holidayStartDayField).toHaveValue(holidayValues.startDay)
    expect(holidayStartYearField).toHaveValue(holidayValues.startYear)

    await user.type(severanceTotal, severanceValues.total)

    expect(severanceTotal).toHaveValue(severanceValues.total)
    expect(severanceDetailsQuery).not.toBeInTheDocument()

    expect(holidayTotal).toHaveValue(holidayValues.total)

    await user.type(continuationTotal, continuationValues.total)
    await user.type(continuationStartMonthField, continuationValues.startMonth)
    await user.type(continuationStartDayField, continuationValues.startDay)
    await user.type(continuationStartYearField, continuationValues.startYear)

    await user.click(holiday)

    const severanceDetailsAtNewIndex = screen.getByTestId(
      'payDetail-payments_received.0'
    )
    severanceTotal = within(severanceDetailsAtNewIndex).getByRole('textbox', {
      name: 'payments_received.payments_received_detail.total.label',
    })

    const continuationDetailsAtNewIndex = screen.getByTestId(
      'payDetail-payments_received.1'
    )
    continuationStartDateGroup = within(
      continuationDetailsAtNewIndex
    ).getByRole('group', {
      name: 'payments_received.payments_received_detail.date_pay_began.label',
    })
    continuationStartMonthField = within(continuationStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.month.label',
      }
    )
    continuationStartDayField = within(continuationStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.day.label',
      }
    )
    continuationStartYearField = within(continuationStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.year.label',
      }
    )
    const ptoDetailsQuery = screen.queryByRole('heading', {
      level: 2,
      name: 'payments_received.payments_received_detail.pay_type.options.holiday.label',
    })

    expect(ptoDetailsQuery).not.toBeInTheDocument()
    expect(severanceTotal).toHaveValue(severanceValues.total)
    expect(continuationTotal).toHaveValue(continuationValues.total)
    expect(continuationStartMonthField).toHaveValue(
      continuationValues.startMonth.replace(/^0+(?=\d)/, '')
    )
    expect(continuationStartDayField).toHaveValue(
      continuationValues.startDay.replace(/^0+(?=\d)/, '')
    )
    expect(continuationStartYearField).toHaveValue(continuationValues.startYear)
  })
})
