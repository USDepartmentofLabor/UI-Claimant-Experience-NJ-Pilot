export type PaymentsReceivedDetailInput = {
  pay_type: PayTypeOption
  note?: string
  total?: string
  date_pay_began?: string
  date_pay_ended?: string
}

export const payTypeOptions = [
  'vacation_sick_pto',
  'final_paycheck',
  'pension_annuity_retirement',
  'severance_or_continuation',
  'other_pay',
  'none',
] as const
export type PayTypeOption = typeof payTypeOptions[number]

export const fillPaymentsReceived = (
  optionsList: PaymentsReceivedDetailInput[]
) => {
  const options = optionsList.sort((option1, option2) => {
    const pay1 = payTypeOptions.indexOf(option1.pay_type)
    const pay2 = payTypeOptions.indexOf(option2.pay_type)

    if (pay1 === -1) return 1
    if (pay2 === -1) return -1

    return pay1 - pay2
  })
  options.forEach((option, index) => {
    if (option.pay_type) {
      cy.get(`input[id="LOCAL_pay_types.${option.pay_type}"]`).parent().click()
    }

    if (option.total) {
      cy.get(`input[id="payments_received.${index}.total"]`).type(option.total)
    }

    if (option.date_pay_began) {
      const [year, month, day] = option.date_pay_began.split('-')
      if (year) {
        cy.get(`input[id="payments_received.${index}.date_pay_began.month"]`)
          .clear()
          .type(month)
      }
      if (month) {
        cy.get(`input[id="payments_received.${index}.date_pay_began.day"]`)
          .clear()
          .type(day)
      }
      if (day) {
        cy.get(`input[id="payments_received.${index}.date_pay_began.year"]`)
          .clear()
          .type(year)
      }
    }

    if (option.date_pay_ended) {
      const [endYear, endMonth, endDay] = option.date_pay_ended.split('-')

      if (endMonth) {
        cy.get(`input[id="payments_received.${index}.date_pay_ended.month"]`)
          .clear()
          .type(endMonth)
      }
      if (endYear) {
        cy.get(`input[id="payments_received.${index}.date_pay_ended.year"]`)
          .clear()
          .type(endYear)
      }
      if (endDay) {
        cy.get(`input[id="payments_received.${index}.date_pay_ended.day"]`)
          .clear()
          .type(endDay)
      }
    }

    if (option.note) {
      cy.get(`textarea[id="payments_received.${index}.note"]`).type(option.note)
    }
  })
}
