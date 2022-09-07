const fillContactFields = () => {
  cy.get('[name=claimant_phone\\.number')
    .should('be.visible')
    .clear()
    .type('555-555-1224')
  cy.get('input[id=claimant_phone\\.sms\\.yes]').parent().click()
  cy.get('[name=alternate_phone\\.number')
    .should('be.visible')
    .clear()
    .type('555-555-1224')
  cy.get('input[id=interpreter_required\\.interpreter]').parent().click()
  cy.get('input[id=preferred_language\\.other]').parent().click()
  cy.get('input[id=preferred_language_other]').clear().type('Klingon')
}

export default fillContactFields
