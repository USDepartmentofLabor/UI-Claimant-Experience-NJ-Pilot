export {}

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
    cy.get('h1').contains('Apply for Unemployment Insurance')
    cy.checkA11y()
    cy.lighthouse({
      accessibility: 100,
      'best-practices': 90,
      seo: 80,
      pwa: 20,
      performance: 30,
    })
  })
})
