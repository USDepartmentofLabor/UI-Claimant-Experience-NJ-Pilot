const homePage = () => {
  cy.wait(4000)
  cy.get('h1').contains('Apply for Unemployment Insurance')
  cy.checkA11y()
  cy.get("button[type='button']")
    .contains('Press Me')
    .scrollIntoView()
    .should('be.visible')
    .click()
}

export default homePage
