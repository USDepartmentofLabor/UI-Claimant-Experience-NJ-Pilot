export {}

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/home')
    cy.get('h1').contains('Apply for unemployment insurance')
    // cy.check_a11y() todo: get configs working to run this
  })
})
