import { fillBusinessInterests } from './businessInterests'
import { fillPaymentsReceived } from './PaymentsReceived'
import fillYourEmployerFields from './yourEmployer'
import fillChangeInEmployment from './changeInEmployment'
import fillWorkLocationSection from './workLocation'

export const fillValidEditEmployer = () => {
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
  fillBusinessInterests({
    self_employed: false,
    is_owner: false,
    corporate_officer_or_stock_ownership: false,
    employer_is_sole_proprietorship: false,
    related_to_owner_or_child_of_owner_under_18: 'child',
  })

  fillChangeInEmployment({
    separation_circumstance: 'laid_off',

    employment_start_date: { mo: '02', day: '20', yr: '2014' },
    employment_last_date: { mo: '02', day: '24', yr: '2022' },
    expect_to_be_recalled: true,
    has_definite_recall_date: true,
    definite_recall_date: { mo: '02', day: '24', yr: '2024' },
    is_seasonal_work: true,
  })
  fillPaymentsReceived([
    {
      pay_type: 'holiday',
      total: '5000.25',
      date_pay_began: '2021-01-15',
      date_pay_ended: '2021-02-18',
    },
    {
      pay_type: 'other_pay',
      total: '5000.25',
      note: 'They slipped me a little extra',
    },
  ])
}

export const fillValidAddEmployer1 = () => {
  fillYourEmployerFields({
    employer_name: 'Google',
    fein: '543211770555581',
    employer_address: {
      address: '19 Mailman road',
      address2: 'APT #111',
      city: 'Harrisburg',
      state: 'PA',
      zipcode: '98765',
    },
    is_full_time: false,
    employer_phone: '111-111-1111',
  })
  fillWorkLocationSection({
    worked_at_employer_address: false,
    alternate_physical_work_address: {
      city: 'Pittsburgh',
      state: 'PA',
      zipcode: '01234',
    },
    is_employer_phone_accurate: false,
    work_location_phone: '321-321-3213',
  })
  fillBusinessInterests({
    self_employed: false,
    is_owner: false,
    corporate_officer_or_stock_ownership: false,
    employer_is_sole_proprietorship: false,
    related_to_owner_or_child_of_owner_under_18: 'parent',
  })

  fillChangeInEmployment({
    separation_circumstance: 'unsatisfactory_work_performance',
    separation_circumstance_details: 'unsatisfactory_work_performance',
    employment_start_date: { mo: '04', day: '20', yr: '2014' },
    employment_last_date: { mo: '04', day: '24', yr: '2022' },
    expect_to_be_recalled: false,
  })
  fillPaymentsReceived([
    {
      pay_type: 'pension_annuity_retirement',
      total: '500000.00',
    },
    {
      pay_type: 'continuation',
      total: '1000.13',
      date_pay_began: '2021-01-11',
      date_pay_ended: '2021-01-20',
    },
  ])
}

export const fillValidAddEmployer2 = () => {
  fillYourEmployerFields({
    employer_name: 'Quiznos',
    fein: '111111770493581',
    employer_address: {
      address: '1800 Hyperloop Avenue',
      address2: 'PO Box: 1111',
      city: 'San Francisco',
      state: 'CA',
      zipcode: '11111',
    },
    is_full_time: true,
    employer_phone: '123-123-1234',
  })
  fillWorkLocationSection({
    worked_at_employer_address: true,
    is_employer_phone_accurate: true,
  })
  fillBusinessInterests({
    self_employed: true,
    is_owner: true,
    corporate_officer_or_stock_ownership: true,
  })
  fillChangeInEmployment({
    separation_circumstance: 'still_employed',
    reason_still_employed: 'reduction_in_hours_by_claimant',
    employment_start_date: { mo: '01', day: '15', yr: '2015' },
    employment_last_date: { mo: '02', day: '22', yr: '2022' },
    expect_to_be_recalled: false,
  })
  fillPaymentsReceived([
    {
      pay_type: 'none',
    },
  ])
}
