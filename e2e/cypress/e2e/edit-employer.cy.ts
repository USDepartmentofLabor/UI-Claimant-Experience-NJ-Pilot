import fillYourEmployerFields from './formPageFilling/yourEmployer'

describe('Edit employer checks', () => {
  it('edit employer loads', () => {
    cy.visit('/dev/edit-employer')
    cy.get('h1').contains('Test Edit Employer Component')
    cy.get('[data-testid=edit-employer-test-subheader]').should('be.visible')
  })
  it('fills out edit employer completely', () => {
    const employerIndexString = '0'
    fillYourEmployerFields(employerIndexString, true)
    /* add other edit employer cypress tests here */
  })
})
