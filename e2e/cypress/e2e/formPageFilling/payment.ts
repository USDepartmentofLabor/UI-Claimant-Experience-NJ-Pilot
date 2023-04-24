const fillPaymentFields = (paymentInformation) => {
  const {
    payment_method,
    account_type,
    routing_number,
    account_number,
    federal_income_tax_withheld,
    apply_for_increased_payment_for_dependents,
  } = paymentInformation

  cy.get(`input[id="payment_method\\.${payment_method}"]`).parent().click()
  cy.get(`input[id="account_type\\.${account_type}"]`).parent().click()
  cy.get('input[id="routing_number"]').type(routing_number)
  cy.get('input[id="LOCAL_re_enter_routing_number"]').type(routing_number)
  cy.get('input[id="account_number"]').type(account_number)
  cy.get('input[id="LOCAL_re_enter_account_number"]').type(account_number)
  cy.get(`input[id="acknowledge_direct_deposit_option"]`).parent().click()
  cy.get(
    `input[id="federal_income_tax_withheld\\.${federal_income_tax_withheld}"]`
  )
    .parent()
    .click()
  cy.get(
    `input[id="apply_for_increased_payment_for_dependents\\.${apply_for_increased_payment_for_dependents}"]`
  )
    .parent()
    .click()
}

export default fillPaymentFields
