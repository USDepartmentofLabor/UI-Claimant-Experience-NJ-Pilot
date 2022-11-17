import fillChangeInEmployment from './formPageFilling/changeInEmployment'
import fillYourEmployerFields from './formPageFilling/yourEmployer'

describe('Edit employer checks', () => {
  it('edit employer loads', () => {
    cy.visit('/dev/edit-employer')
    cy.get('h1').contains('Test Edit Employer Component')
    cy.get('[data-testid=edit-employer-test-subheader]').should('be.visible')
  })
  it('fills out edit employer completely', () => {
    const employerIndexString = '0'
    fillYourEmployerFields(employerIndexString, { is_full_time: true })

    fillChangeInEmployment(employerIndexString, {
      separation_circumstance: 'laid_off',

      employment_start_date: { mo: '02', day: '20', yr: '2014' },
      employment_last_date: { mo: '02', day: '24', yr: '2022' },
      expect_to_be_recalled: false,
    })
    /* add other edit employer cypress tests here */
  })
})
