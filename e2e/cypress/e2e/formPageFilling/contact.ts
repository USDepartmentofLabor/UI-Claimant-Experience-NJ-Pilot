const fillContactFields = () => {
  cy.get('[name=phones\\[0\\]\\.number')
    .should('be.visible')
    .clear()
    .type('555-555-1224')
  cy.get('[name=phones\\[0\\]\\.type')
    .select('mobile')
    .should('have.value', 'mobile')
  cy.get('input[id=interpreter_required\\.yes]').parent().click()
  cy.get('input[id=preferred_language]').clear().type('Klingon')
}

export default fillContactFields
