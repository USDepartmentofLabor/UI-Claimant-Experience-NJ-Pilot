export {}

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
    cy.get('h1').contains('Apply for Unemployment Insurance')
    cy.checkA11y()
  })
})
