import { fillYourEmployerFields } from './employer/yourEmployer'
import { fillWorkLocationSection } from './employer/workLocation'
import { fillBusinessInterests } from './employer/businessInterests'
import { fillChangeInEmployment } from './employer/changeInEmployment'
import { fillPaymentsReceived } from './employer/PaymentsReceived'

export const fillEditEmployerFields = () => {
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
}
