const fillContactFields = () => {
  cy.get('[name=claimant_phone\\.number')
    .should('be.visible')
    .clear()
    .type('555-555-1224')
  cy.get('input[id=claimant_phone\\.sms\\.yes]').parent().click()
  cy.get('[name=alternate_phone\\.number')
    .should('be.visible')
    .clear()
    .type('555-555-4321')
  cy.get('input[id=interpreter_required\\.interpreter]').parent().click()
  cy.get('input[id=preferred_language\\.other]').parent().click()
  cy.get('input[id=preferred_language_other]').clear().type('Klingon')
}

const checkUpdatedContactFields = () => {
  cy.clickLink('/claim/contact', 'Edit')
  // Verify reaching the contact page
  cy.url().should('eq', `${Cypress.config().baseUrl}/claim/contact`)
  // Click no interpreter required
  cy.get('input[id=interpreter_required\\.no_interpreter_tty]').parent().click()
  cy.clickNext()
  // Wait to land on the next page
  cy.url().should('not.equal', `${Cypress.config().baseUrl}/claim/contact`)
  // Toggle accordion open
  cy.get('button').contains('Form steps').click()
  cy.clickLink('/claim/review', 'Review application')
  // Toggle accordion closed
  cy.get('button').contains('Form steps').click()
  // Language fields should not appear after update
  cy.get('legend').contains('What language do you speak?').should('not.exist')
  cy.get('legend').contains('Enter the language you speak').should('not.exist')
}

export { fillContactFields, checkUpdatedContactFields }
