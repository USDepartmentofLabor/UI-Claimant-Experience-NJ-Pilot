const homePage = () => {
  cy.wait(4000)
  cy.get('h1').contains('Apply for Unemployment Insurance')
  cy.checkA11y()
  cy.lighthouse({
    accessibility: 100,
    'best-practices': 90,
    seo: 90,
    pwa: 20,
    performance: 30,
  })
  cy.get("button[type='button']")
    .contains('Press Me')
    .scrollIntoView()
    .should('be.visible')
    .click()
}

export default homePage
