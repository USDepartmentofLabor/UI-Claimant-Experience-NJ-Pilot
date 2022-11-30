import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'

import { noop } from 'helpers/noop/noop'
import PaymentsReceived from 'components/form/employer/PaymentsReceived/PaymentsReceived'

describe('PaymentsReceived', () => {
  const defaultInitialValues = { employers: [{ payments_received: [] }] }
  const renderPaymentsReceived = (
    initialValues: object = defaultInitialValues
  ) => {
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <PaymentsReceived employerIndex={0} />
      </Formik>
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
        name: 'payments_received.payments_received_detail.pay_type.options.severance_or_continuation.label payments_received.payments_received_detail.pay_type.options.severance_or_continuation.description',
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
    renderPaymentsReceived()
    expect(
      screen.getByRole('group', {
        name: 'payments_received.payments_received_detail.pay_type.label',
      })
    ).toBeInTheDocument()
  })

  it('opens additional fields based on pay type selection', async () => {
    const { user, pto, otherPay, getOtherPayNoteField } =
      renderPaymentsReceived()

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
      employers: [
        {
          payments_received: [
            {
              pay_type: 'vacation_sick_pto',
              total: 3000,
            },
            {
              pay_type: 'severance_or_continuation',
              total: 500,
              note: 'They paid a small severance',
            },
          ],
        },
      ],
    }

    const { user, vacation, severance, noOtherPay } =
      renderPaymentsReceived(initialValues)

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
    const { user, pto, severance, otherPay } = renderPaymentsReceived()

    await user.click(severance)
    await user.click(pto)
    await user.click(otherPay)

    const payDetails = screen.getAllByRole('heading', { level: 3 })
    expect(payDetails).toHaveLength(3)
    expect(payDetails[0]).toHaveTextContent('vacation_sick_pto')
    expect(payDetails[1]).toHaveTextContent('severance_or_continuation')
    expect(payDetails[2]).toHaveTextContent('other_pay')
  })

  it('displays the correct values in the details when pay types are removed', async () => {
    const { user, pto, severance } = renderPaymentsReceived()

    await user.click(pto)
    await user.click(severance)

    const ptoDetails = screen.getByTestId(
      'payDetail-employers[0].payments_received.0'
    )
    const ptoTotal = within(ptoDetails).getByRole('textbox', {
      name: 'payments_received.payments_received_detail.total.label',
    })

    const ptoStartDateGroup = within(ptoDetails).getByRole('group', {
      name: 'payments_received.payments_received_detail.date_pay_began.label',
    })
    const ptoStartMonthField = within(ptoStartDateGroup).getByRole('textbox', {
      name: 'date.month.label',
    })
    const ptoStartDayField = within(ptoStartDateGroup).getByRole('textbox', {
      name: 'date.day.label',
    })
    const ptoStartYearField = within(ptoStartDateGroup).getByRole('textbox', {
      name: 'date.year.label',
    })

    const severanceDetails = screen.getByTestId(
      'payDetail-employers[0].payments_received.1'
    )
    let severanceTotal = within(severanceDetails).getByRole('textbox', {
      name: 'payments_received.payments_received_detail.total.label',
    })

    let severanceStartDateGroup = within(severanceDetails).getByRole('group', {
      name: 'payments_received.payments_received_detail.date_pay_began.label',
    })
    let severanceStartMonthField = within(severanceStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.month.label',
      }
    )
    let severanceStartDayField = within(severanceStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.day.label',
      }
    )
    let severanceStartYearField = within(severanceStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.year.label',
      }
    )

    const [ptoValues, severanceValues] = [
      { total: '333', startMonth: '08', startDay: '20', startYear: '2022' },
      { total: '666', startMonth: '09', startDay: '14', startYear: '2021' },
    ]

    await user.type(ptoTotal, ptoValues.total)
    await user.type(ptoStartMonthField, ptoValues.startMonth)
    await user.type(ptoStartDayField, ptoValues.startDay)
    await user.type(ptoStartYearField, ptoValues.startYear)

    expect(ptoTotal).toHaveValue(ptoValues.total)
    expect(ptoStartMonthField).toHaveValue(ptoValues.startMonth)
    expect(ptoStartDayField).toHaveValue(ptoValues.startDay)
    expect(ptoStartYearField).toHaveValue(ptoValues.startYear)

    await user.type(severanceTotal, severanceValues.total)
    await user.type(severanceStartMonthField, severanceValues.startMonth)
    await user.type(severanceStartDayField, severanceValues.startDay)
    await user.type(severanceStartYearField, severanceValues.startYear)

    expect(severanceTotal).toHaveValue(severanceValues.total)
    expect(severanceStartMonthField).toHaveValue(severanceValues.startMonth)
    expect(severanceStartDayField).toHaveValue(severanceValues.startDay)
    expect(severanceStartYearField).toHaveValue(severanceValues.startYear)

    await user.click(pto)

    const severanceDetailsAtNewIndex = screen.getByTestId(
      'payDetail-employers[0].payments_received.0'
    )
    severanceTotal = within(severanceDetailsAtNewIndex).getByRole('textbox', {
      name: 'payments_received.payments_received_detail.total.label',
    })

    severanceStartDateGroup = within(severanceDetailsAtNewIndex).getByRole(
      'group',
      {
        name: 'payments_received.payments_received_detail.date_pay_began.label',
      }
    )
    severanceStartMonthField = within(severanceStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.month.label',
      }
    )
    severanceStartDayField = within(severanceStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.day.label',
      }
    )
    severanceStartYearField = within(severanceStartDateGroup).getByRole(
      'textbox',
      {
        name: 'date.year.label',
      }
    )
    const ptoDetailsQuery = screen.queryByRole('heading', {
      level: 2,
      name: 'payments_received.payments_received_detail.pay_type.options.vacation_sick_pto.label',
    })

    expect(ptoDetailsQuery).not.toBeInTheDocument()
    expect(severanceTotal).toHaveValue(severanceValues.total)
    expect(severanceStartMonthField).toHaveValue(
      severanceValues.startMonth.replace(/^0+(?=\d)/, '')
    )
    expect(severanceStartDayField).toHaveValue(
      severanceValues.startDay.replace(/^0+(?=\d)/, '')
    )
    expect(severanceStartYearField).toHaveValue(severanceValues.startYear)
  })
})
