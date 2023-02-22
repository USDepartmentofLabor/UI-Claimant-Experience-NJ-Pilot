import { render, screen } from '@testing-library/react'
import { EmployersReview } from './EmployersReview'
import {
  AddressWithoutStreetInput,
  ClaimantInput,
  Employer,
  ImportedEmployerAddress,
  PaymentsReceivedDetailInput,
  PhoneInput,
} from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { formatStoredDateToDisplayDate } from 'utils/date/format'
import {
  ChangeInEmploymentOption,
  EmployerRelationOption,
  PayTypeOption,
  ReasonStillEmployedOption,
} from 'constants/formOptions'
describe('EmployerReview component', () => {
  const renderEmployerReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <EmployersReview />
      </ClaimFormContext.Provider>
    )

    //verified fields
    const employerAddress = screen.queryAllByRole('group', {
      name: 'verified_fields.employer_address',
    })

    const phoneNumber = screen.queryAllByRole('group', {
      name: 'verified_fields.employer_phone',
    })

    const fein = screen.queryAllByRole('group', {
      name: 'verified_fields.fein',
    })

    //your employer
    const isFullTimePartTime = screen.queryByRole('group', {
      name: 'your_employer.is_full_time.label',
    })

    //work location
    const workedAtAddress = screen.queryAllByRole('group', {
      name: 'work_location.worked_at_employer_address.label',
    })
    const altAddress = screen.queryAllByRole('group', {
      name: 'work_location.section_title',
    })
    const accuratePhoneNumber = screen.queryAllByRole('group', {
      name: 'work_location.is_employer_phone_accurate.label',
    })
    const altPhone = screen.queryAllByRole('group', {
      name: 'alt_employer_phone',
    })

    //business interests
    const selfEmployed = screen.queryAllByRole('group', {
      name: 'business_interests.self_employed.label',
    })
    const isOwner = screen.queryAllByRole('group', {
      name: 'business_interests.is_owner.label',
    })
    const coporateOfficerOrStockerOwnership = screen.queryAllByRole('group', {
      name: 'business_interests.corporate_officer_or_stock_ownership.label',
    })
    const isSoleProprietorship = screen.queryAllByRole('group', {
      name: 'business_interests.employer_is_sole_proprietorship.label',
    })
    const relatedToOwner = screen.queryAllByRole('group', {
      name: 'business_interests.related_to_owner_or_child_of_owner_under_18.label',
    })

    //separation
    const separationCircumstance = screen.queryAllByRole('group', {
      name: 'separation.reason.label',
    })
    const reasonStillEmployed = screen.queryAllByRole('group', {
      name: 'separation.reasons.still_employed.option_heading',
    })
    const separationDetails = screen.queryAllByRole('group', {
      name: 'separation.separation_circumstance_details.required_label',
    })
    const employmentStartDate = screen.queryAllByRole('group', {
      name: 'employment_start_date.label',
    })
    const employmentEndDate = screen.queryAllByRole('group', {
      name: 'employment_last_date.label',
    })
    const hoursReducedBy20Percent = screen.queryAllByRole('group', {
      name: 'hours_reduced_twenty_percent.label',
    })
    const dishchargeDate = screen.queryAllByRole('group', {
      name: 'discharge_date.label',
    })
    const expectToBeRecalled = screen.queryAllByRole('group', {
      name: 'separation.expect_to_be_recalled.label',
    })
    const definiteRecall = screen.queryAllByRole('group', {
      name: 'separation.definite_recall.label',
    })
    const definiteRecallDate = screen.queryAllByRole('group', {
      name: 'separation.definite_recall_date.label',
    })
    const isSeasonalWork = screen.queryAllByRole('group', {
      name: 'separation.is_seasonal_work.label',
    })

    //payments
    const paymentsReceivedList = screen.queryAllByRole('group', {
      name: 'payments_received.payments_received_detail.pay_type.label',
    })
    const datePayBegan = screen.queryAllByRole('group', {
      name: 'date_pay_began.reviewLabel',
    })
    const datePayEnded = screen.queryAllByRole('group', {
      name: 'date_pay_ended.reviewLabel',
    })

    const otherNote = screen.queryAllByRole('group', {
      name: 'other_note.reviewLabel',
    })
    const totalOfPay = screen.queryAllByRole('group', {
      name: 'total.reviewLabel',
    })

    return {
      employerAddress,
      phoneNumber,
      fein,
      isFullTimePartTime,
      workedAtAddress,
      altAddress,
      accuratePhoneNumber,
      altPhone,
      selfEmployed,
      isOwner,
      coporateOfficerOrStockerOwnership,
      isSoleProprietorship,
      relatedToOwner,
      separationCircumstance,
      reasonStillEmployed,
      separationDetails,
      employmentStartDate,
      employmentEndDate,
      hoursReducedBy20Percent,
      dishchargeDate,
      expectToBeRecalled,
      definiteRecall,
      definiteRecallDate,
      isSeasonalWork,
      paymentsReceivedList,
      datePayBegan,
      datePayEnded,
      otherNote,
      totalOfPay,
    }
  }

  it('rendersCorrectly with imported employer', () => {
    const values = {
      employers: [
        {
          employer_phone: { number: '555-555-5555', sms: false } as PhoneInput,
          fein: 'fake fein',
          employer_name: 'Jamba Juice',
          is_full_time: true,
          is_imported: true,
          imported_address: {
            employerAddressLine1: 'Building 1',
            employerAddressLine2: ' Really long name',
            employerAddressLine3: '123 main street',
            employerAddressLine5: 'Smallville, KS',
            employerAddressZip: '12345',
          } as ImportedEmployerAddress,
          worked_for_imported_employer_in_last_18mo: true,
          separation_circumstance: 'laid_off' as ChangeInEmploymentOption,
          expect_to_be_recalled: false,
          employment_start_date: '2021-12-12',
          employment_last_date: '2022-12-13',

          worked_at_employer_address: true,
          is_employer_phone_accurate: true,

          self_employed: true,
          is_owner: true,
          corporate_officer_or_stock_ownership: true,
          LOCAL_pay_types: ['none' as PayTypeOption],
          payments_received: [
            {
              pay_type: 'none',
            } as PaymentsReceivedDetailInput,
          ],
        } as Employer,
      ],
    }

    const {
      employerAddress,
      phoneNumber,
      fein,
      isFullTimePartTime,
      workedAtAddress,
      altAddress,
      accuratePhoneNumber,
      altPhone,
      selfEmployed,
      isOwner,
      coporateOfficerOrStockerOwnership,
      isSoleProprietorship,
      relatedToOwner,
      separationCircumstance,
      reasonStillEmployed,
      separationDetails,
      employmentStartDate,
      employmentEndDate,
      hoursReducedBy20Percent,
      dishchargeDate,
      expectToBeRecalled,
      definiteRecall,
      definiteRecallDate,
      isSeasonalWork,
      paymentsReceivedList,
    } = renderEmployerReview(values)
    //verified fields
    expect(employerAddress[0]).toHaveTextContent(
      `Building 1 Really long name 123 main street Smallville, KS 12345`
    )

    expect(phoneNumber[0]).toHaveTextContent('555-555-5555')
    expect(fein[0]).toHaveTextContent(values.employers[0].fein)
    //your employer
    expect(isFullTimePartTime).toHaveTextContent('yes')
    //work location
    expect(workedAtAddress[0]).toHaveTextContent('yes')
    expect(altAddress.length).toBe(0)
    expect(accuratePhoneNumber[0]).toHaveTextContent('yes')
    expect(altPhone.length).toBe(0)
    //business interests
    expect(selfEmployed[0]).toHaveTextContent('yes')
    expect(isOwner[0]).toHaveTextContent('yes')
    expect(coporateOfficerOrStockerOwnership[0]).toHaveTextContent('yes')
    expect(isSoleProprietorship.length).toBe(0)
    expect(relatedToOwner.length).toBe(0)
    //separation circumstance
    expect(separationCircumstance[0]).toHaveTextContent(
      'separation.reason.labelseparation.reasons.laid_off.label'
    )
    expect(reasonStillEmployed.length).toBe(0)
    expect(separationDetails.length).toBe(0)
    expect(employmentStartDate[0]).toHaveTextContent(
      formatStoredDateToDisplayDate('2021-12-12') as string
    )
    expect(employmentEndDate[0]).toHaveTextContent(
      formatStoredDateToDisplayDate('2022-12-13') as string
    )
    expect(hoursReducedBy20Percent.length).toBe(0)
    expect(dishchargeDate.length).toBe(0)
    expect(expectToBeRecalled[0]).toHaveTextContent('no')
    expect(definiteRecall.length).toBe(0)
    expect(definiteRecallDate.length).toBe(0)
    expect(isSeasonalWork.length).toBe(0)

    //payment
    expect(paymentsReceivedList[0]).toHaveTextContent(
      'payments_received.payments_received_detail.pay_type.options.none.label'
    )
  })

  it('shows conditional values for Work location', () => {
    const values = {
      employers: [
        {
          employer_name: 'Jamba Juice',
          is_full_time: true,
          is_imported: true,
          imported_address: {
            employerAddressLine1: 'Building 1',
            employerAddressLine2: ' Really long name',
            employerAddressLine3: '123 main street',
            employerAddressLine4: null,
            employerAddressLine5: 'Smallville, KS',
            employerAddressZip: '12345',
          } as ImportedEmployerAddress,
          worked_for_imported_employer_in_last_18mo: true,

          worked_at_employer_address: false,
          alternate_physical_work_address: {
            city: 'I am a city',
            state: 'CA',
            zipcode: '12345',
          } as AddressWithoutStreetInput,
          is_employer_phone_accurate: false,
          LOCAL_pay_types: ['none' as PayTypeOption],
          payments_received: [
            {
              pay_type: 'none' as PayTypeOption,
              note: '',
              total: '',
              date_pay_began: '',
              date_pay_ended: '',
            } as PaymentsReceivedDetailInput,
          ],
          work_location_phone: { number: '1234567890' } as PhoneInput,
        } as Employer,
      ],
    }

    const { workedAtAddress, altAddress, accuratePhoneNumber, altPhone } =
      renderEmployerReview(values)
    //work location
    expect(workedAtAddress[0]).toHaveTextContent('no')
    expect(altAddress[0]).toHaveTextContent(
      `${values.employers[0].alternate_physical_work_address.city}, ${values.employers[0].alternate_physical_work_address.state} ${values.employers[0].alternate_physical_work_address.zipcode}`
    )
    expect(accuratePhoneNumber[0]).toHaveTextContent('no')
    expect(altPhone[0]).toHaveTextContent('123-456-7890')
  })

  it('shows conditional values for business interests', () => {
    const values = {
      employers: [
        {
          employer_name: 'Jamba Juice',
          self_employed: true,
          is_owner: true,
          corporate_officer_or_stock_ownership: false,
          employer_is_sole_proprietorship: false,
          related_to_owner_or_child_of_owner_under_18:
            'parent' as EmployerRelationOption,
        } as Employer,
      ],
    }

    const {
      coporateOfficerOrStockerOwnership,
      isSoleProprietorship,
      relatedToOwner,
    } = renderEmployerReview(values)

    //business interests
    expect(coporateOfficerOrStockerOwnership[0]).toHaveTextContent('no')
    expect(isSoleProprietorship[0]).toHaveTextContent('no')
    expect(relatedToOwner[0]).toHaveTextContent(
      'business_interests.related_to_owner_or_child_of_owner_under_18.options.parent.label'
    )
  })

  it('shows conditional values for separation circumstance-still employed', () => {
    const values = {
      employers: [
        {
          employer_name: 'Jamba Juice',
          is_imported: true,
          worked_for_imported_employer_in_last_18mo: true,
          separation_circumstance: 'still_employed' as ChangeInEmploymentOption,
          reason_still_employed:
            'reduction_in_hours_by_employer' as ReasonStillEmployedOption,
          hours_reduced_twenty_percent: true,
          is_seasonal_work: true,
        } as Employer,
      ],
    }

    const { reasonStillEmployed, hoursReducedBy20Percent, isSeasonalWork } =
      renderEmployerReview(values)
    expect(reasonStillEmployed[0]).toHaveTextContent(
      'separation.reasons.still_employed.options.reduction_in_hours_by_employer'
    )
    expect(hoursReducedBy20Percent[0]).toHaveTextContent('yes')
    expect(isSeasonalWork[0]).toHaveTextContent('yes')
  })

  it('shows conditional values for separation circumstance: separation details and discharge date', () => {
    const values = {
      employers: [
        {
          employer_name: 'Jamba Juice',
          is_imported: true,
          worked_for_imported_employer_in_last_18mo: true,
          separation_circumstance:
            'fired_discharged_suspended' as ChangeInEmploymentOption,
          separation_circumstance_details: 'im a blob of text',
          discharge_date: '2021-12-12',
        } as Employer,
      ],
    }

    const { separationDetails, dishchargeDate } = renderEmployerReview(values)

    expect(separationDetails[0]).toHaveTextContent('im a blob of text')
    expect(dishchargeDate[0]).toHaveTextContent(
      formatStoredDateToDisplayDate('2021-12-12') as string
    )
  })

  it('shows conditional values for separation circumstance: recall fields', () => {
    const values = {
      employers: [
        {
          employer_name: 'Jamba Juice',
          is_full_time: true,
          is_imported: true,
          worked_for_imported_employer_in_last_18mo: true,
          separation_circumstance: 'laid_off' as ChangeInEmploymentOption,
          expect_to_be_recalled: true,
          definite_recall: true,
          definite_recall_date: '2022-12-13',
          is_seasonal_work: true,
        } as Employer,
      ],
    }

    const { expectToBeRecalled, definiteRecall, definiteRecallDate } =
      renderEmployerReview(values)
    expect(expectToBeRecalled[0]).toHaveTextContent('yes')
    expect(definiteRecall[0]).toHaveTextContent('yes')
    expect(definiteRecallDate[0]).toHaveTextContent(
      formatStoredDateToDisplayDate('2022-12-13') as string
    )
  })
  it('shows manually added employer address', () => {
    const values = {
      employers: [
        {
          employer_address: {
            address: 'building 1',
            address2: '123 main street',
            address3: '',
            city: 'smallville',
            state: 'KS',
            zipcode: '12345',
          },

          employer_name: 'Jamba Juice',
          worked_at_employer_address: true,
          is_full_time: true,
          is_imported: false,
          imported_address: null,
        } as Employer,
      ],
    }

    const { employerAddress } = renderEmployerReview(values)
    expect(employerAddress.length).toBe(1)
    expect(employerAddress[0]).toHaveTextContent(
      `building 1, 123 main street, smallville, KS 12345`
    )
  })

  it('shows all payments', () => {
    const values = {
      employers: [
        {
          employer_name: 'Jamba Juice',
          is_imported: false,
          payments_received: [
            {
              pay_type: 'other_pay',
              note: 'i am some other note',
              total: '10000',
            } as PaymentsReceivedDetailInput,
            {
              pay_type: 'holiday',
              total: '20000',
              date_pay_began: '2021-12-12',
              date_pay_ended: '2022-12-13',
            } as PaymentsReceivedDetailInput,
          ],
        } as Employer,
      ],
    }

    const { datePayBegan, datePayEnded, otherNote, totalOfPay } =
      renderEmployerReview(values)
    expect(datePayBegan.length).toBe(1)
    expect(datePayBegan[0]).toHaveTextContent(
      formatStoredDateToDisplayDate('2021-12-12') as string
    )

    expect(datePayEnded.length).toBe(1)
    expect(datePayEnded[0]).toHaveTextContent(
      formatStoredDateToDisplayDate('2022-12-13') as string
    )

    expect(totalOfPay.length).toBe(2)
    expect(totalOfPay[0].textContent).toMatch(`200.00`)
    expect(totalOfPay[1].textContent).toMatch(`100.00`)

    expect(otherNote.length).toBe(1)
    expect(otherNote[0]).toHaveTextContent('i am some other note')
  })

  it('Employers are not displayed if user selects no for all available employers', () => {
    const values = {
      employers: [
        {
          employer_name: 'Jamba Juice',
          is_imported: true,
          worked_for_imported_employer_in_last_18mo: false,
          separation_circumstance: 'still_employed' as ChangeInEmploymentOption,
          reason_still_employed:
            'reduction_in_hours_by_employer' as ReasonStillEmployedOption,
          hours_reduced_twenty_percent: true,
          is_seasonal_work: true,
        } as Employer,
      ],
    }

    const { reasonStillEmployed, hoursReducedBy20Percent, isSeasonalWork } =
      renderEmployerReview(values)
    expect(reasonStillEmployed.length).toBe(0)
    expect(hoursReducedBy20Percent.length).toBe(0)
    expect(isSeasonalWork.length).toBe(0)
  })
})
