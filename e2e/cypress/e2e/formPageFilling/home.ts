const homePage = () => {
  cy.get("h1[data-testid='home-page-heading']").contains(
    'Apply for Unemployment Insurance'
  )
  cy.checkA11y()
  cy.checkLighthouse()
  cy.get("button[data-testid='go-to-claim-form']")
    .scrollIntoView()
    .should('be.visible')
    .click()
}

export default homePage
