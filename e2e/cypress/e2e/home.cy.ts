export {}

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/home')
    cy.get('h1').contains('Apply for unemployment insurance')
    // @ts-ignore
    cy.check_a11y()
  })
})
