import fillChangeInEmployment from './formPageFilling/changeInEmployment'
import fillYourEmployerFields from './formPageFilling/yourEmployer'
import fillWorkLocationSection from '../e2e/formPageFilling/employer/workLocation'
import { fillBusinessInterests } from '../e2e/formPageFilling/employer/businessInterests'

import { fillPaymentsReceived } from './formPageFilling/PaymentsReceived'

describe('Edit employer checks', () => {
  // TODO: Use only employerIndex after refactor to utilize number rather than string
  const employerIndex = 0
  const employerIndexString = '0'

  it('edit employer loads', () => {
    cy.visit('/dev/edit-employer')
    cy.get('h1').contains('Test Edit Employer Component')
    cy.get('[data-testid=edit-employer-test-subheader]').should('be.visible')
  })
  it('fills out edit employer completely', () => {
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
    fillBusinessInterests(employerIndexString)
    fillChangeInEmployment(employerIndexString, {
      separation_circumstance: 'laid_off',

      employment_start_date: { mo: '02', day: '20', yr: '2014' },
      employment_last_date: { mo: '02', day: '24', yr: '2022' },
      expect_to_be_recalled: false,
    })
    fillChangeInEmployment(employerIndexString, {
      separation_circumstance: 'fired_discharged_suspended',
      separation_circumstance_details: 'Test text',
      employment_start_date: { mo: '03', day: '20', yr: '2014' },
      employment_last_date: { mo: '03', day: '24', yr: '2022' },
      discharge_date: { mo: '03', day: '24', yr: '2022' },
      expect_to_be_recalled: false,
    })
    fillPaymentsReceived(employerIndex)
    /* add other edit employer cypress tests here */
  })
})
