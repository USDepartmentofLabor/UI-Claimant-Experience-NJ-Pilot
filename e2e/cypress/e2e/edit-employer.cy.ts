import fillChangeInEmployment from './formPageFilling/changeInEmployment'
import fillYourEmployerFields from './formPageFilling/yourEmployer'
import fillWorkLocationSection from '../e2e/formPageFilling/employer/workLocation'
import { fillBusinessInterests } from '../e2e/formPageFilling/employer/businessInterests'

describe('Edit employer checks', () => {
  const employerIndex = '0'

  it('edit employer loads', () => {
    cy.visit('/dev/edit-employer')
    cy.get('h1').contains('Test Edit Employer Component')
    cy.get('[data-testid=edit-employer-test-subheader]').should('be.visible')
  })
  it('fills out edit employer completely', () => {
    const employerIndexString = '0'
    fillYourEmployerFields(employerIndexString, { is_full_time: true })
    fillWorkLocationSection(employerIndexString, {
      worked_at_employer_address: false,
      alternate_physical_work_address: {
        city: 'Seattle',
        state: 'WA',
        zipcode: '01234',
      },
      is_employer_phone_accurate: false,
      work_location_phone: '123-456-7890',
    })
    fillBusinessInterests(employerIndex)
    fillChangeInEmployment(employerIndexString, {
      separation_circumstance: 'laid_off',

      employment_start_date: { mo: '02', day: '20', yr: '2014' },
      employment_last_date: { mo: '02', day: '24', yr: '2022' },
      expect_to_be_recalled: true,
      has_definite_recall_date: true,
      definite_recall_date: { mo: '02', day: '24', yr: '2024' },
      is_seasonal_work: true,
    })
    /* add other edit employer cypress tests here */
  })
})
