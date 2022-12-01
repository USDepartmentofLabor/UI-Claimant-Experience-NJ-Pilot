export const fillPaymentsReceived = (employerIndex) => {
  const paymentsReceived = [
    {
      index: 0,
      pay_type: 'vacation_sick_pto',
      total: '5000.25',
      date_pay_began: '2021-01-15',
      date_pay_ended: '2021-02-18',
    },
    {
      index: 1,
      pay_type: 'other_pay',
      total: '5000.25',
      note: 'They slipped me a little extra',
    },
  ]
  const payment1 = paymentsReceived[0]
  const payment2 = paymentsReceived[1]
  const [year1, month1, day1] = payment1.date_pay_began.split('-')
  const [year2, month2, day2] = payment1.date_pay_ended.split('-')

  cy.get(
    `input[id="employers[${employerIndex}].LOCAL_pay_types.${payment1.pay_type}"]`
  )
    .parent()
    .click()
  cy.get(
    `input[id="employers[${employerIndex}].LOCAL_pay_types.${payment2.pay_type}"]`
  )
    .parent()
    .click()

  cy.get(
    `input[id="employers[${employerIndex}].payments_received.${payment1.index}.total"]`
  ).type(payment1.total)
  cy.get(
    `input[id="employers[${employerIndex}].payments_received.${payment1.index}.date_pay_began.month"]`
  )
    .clear()
    .type(month1)
  cy.get(
    `input[id="employers[${employerIndex}].payments_received.${payment1.index}.date_pay_began.day"]`
  )
    .clear()
    .type(day1)
  cy.get(
    `input[id="employers[${employerIndex}].payments_received.${payment1.index}.date_pay_began.year"]`
  )
    .clear()
    .type(year1)
  cy.get(
    `input[id="employers[${employerIndex}].payments_received.${payment1.index}.date_pay_ended.month"]`
  )
    .clear()
    .type(month2)
  cy.get(
    `input[id="employers[${employerIndex}].payments_received.${payment1.index}.date_pay_ended.day"]`
  )
    .clear()
    .type(day2)
  cy.get(
    `input[id="employers[${employerIndex}].payments_received.${payment1.index}.date_pay_ended.year"]`
  )
    .clear()
    .type(year2)

  cy.get(
    `input[id="employers[${employerIndex}].payments_received.${payment2.index}.total"]`
  ).type(payment2.total)
  cy.get(
    `textarea[id="employers[${employerIndex}].payments_received.${payment2.index}.note"]`
  ).type(payment2.note)
}
