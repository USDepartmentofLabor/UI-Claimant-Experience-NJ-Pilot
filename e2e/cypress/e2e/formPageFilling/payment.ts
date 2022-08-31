const fillPaymentFields = (paymentInformation) => {
  const {
    federal_income_tax_withheld,
    payment_method,
    account_type,
    routing_number,
    account_number,
  } = paymentInformation

  cy.get(
    `input[id="federal_income_tax_withheld\\.${federal_income_tax_withheld}"]`
  )
    .parent()
    .click()
  cy.get(`input[id="payment_method\\.${payment_method}"]`).parent().click()
  cy.get(`input[id="account_type\\.${account_type}"]`).parent().click()
  cy.get('input[id="routing_number"]').type(routing_number)
  cy.get('input[id="LOCAL_re_enter_routing_number"]').type(routing_number)
  cy.get('input[id="account_number"]').type(account_number)
  cy.get('input[id="LOCAL_re_enter_account_number"]').type(account_number)
}

export default fillPaymentFields
