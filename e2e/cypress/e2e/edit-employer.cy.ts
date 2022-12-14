import { fillChangeInEmployment } from '../e2e/formPageFilling/employer/changeInEmployment'
import { fillYourEmployerFields } from '../e2e/formPageFilling/employer/yourEmployer'
import { fillWorkLocationSection } from '../e2e/formPageFilling/employer/workLocation'
import { fillBusinessInterests } from '../e2e/formPageFilling/employer/businessInterests'

import { fillPaymentsReceived } from '../e2e/formPageFilling/employer/PaymentsReceived'

describe('Edit employer checks', () => {
  it('edit employer loads', () => {
    cy.visit('/dev/edit-employer')
    cy.get('h1').contains('Test Edit Employer Component')
    cy.get('[data-testid=edit-employer-test-subheader]').should('be.visible')
  })
  it('fills out edit employer completely', () => {
    fillYourEmployerFields({ is_full_time: true })
    fillWorkLocationSection({
      worked_at_employer_address: false,
      alternate_physical_work_address: {
        city: 'Seattle',
        state: 'WA',
        zipcode: '01234',
      },
      is_employer_phone_accurate: false,
      work_location_phone: '123-456-7890',
    })
    fillBusinessInterests()
    fillChangeInEmployment({
      separation_circumstance: 'laid_off',

      employment_start_date: { mo: '02', day: '20', yr: '2014' },
      employment_last_date: { mo: '02', day: '24', yr: '2022' },
      expect_to_be_recalled: true,
      has_definite_recall_date: true,
      definite_recall_date: { mo: '02', day: '24', yr: '2024' },
      is_seasonal_work: true,
    })
    fillChangeInEmployment({
      separation_circumstance: 'fired_discharged_suspended',
      separation_circumstance_details: 'Test text',
      employment_start_date: { mo: '03', day: '20', yr: '2014' },
      employment_last_date: { mo: '03', day: '24', yr: '2022' },
      discharge_date: { mo: '03', day: '24', yr: '2022' },
      expect_to_be_recalled: false,
    })
    fillChangeInEmployment({
      separation_circumstance: 'unsatisfactory_work_performance',
      separation_circumstance_details: 'unsatisfactory_work_performance',
      employment_start_date: { mo: '04', day: '20', yr: '2014' },
      employment_last_date: { mo: '04', day: '24', yr: '2022' },
      expect_to_be_recalled: false,
    })
    fillPaymentsReceived()
    /* add other edit employer cypress tests here */
  })
  it('fills still employed-change in employment sections', () => {
    fillChangeInEmployment({
      separation_circumstance: 'still_employed',
      reason_still_employed: 'reduction_in_hours_by_employer',
      hours_reduced_twenty_percent: true,
    })
  })
})
