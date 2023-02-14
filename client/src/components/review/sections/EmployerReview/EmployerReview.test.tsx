import { render, screen } from '@testing-library/react'
import { EmployersReview } from './EmployerReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
describe('EmployerReview component', () => {
  const renderEmployerReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <EmployersReview />
      </ClaimFormContext.Provider>
    )
    screen.debug()
    //verified fields
    const importedEmployerAddress = screen.queryAllByRole('group', {
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
    const workedAtAddress = screen.getByRole('group', {
      name: 'work_location.worked_at_employer_address.label',
    })
    const altAddress = screen.queryAllByRole('group', {
      name: 'work_location.section_title',
    })
    const accuratePhoneNumber = screen.getByRole('group', {
      name: 'work_location.is_employer_phone_accurate.label',
    })
    const altPhone = screen.queryAllByRole('group', {
      name: 'alt_employer_phone',
    })

    //business interests
    const selfEmployed = screen.getByRole('group', {
      name: 'business_interests.self_employed.label',
    })
    const isOwner = screen.getByRole('group', {
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
    return {
      importedEmployerAddress,
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
    }
  }
  it('rendersCorrectly with imported employer', () => {
    const values = {
      employers: [
        {
          mployer_address: undefined,
          employer_phone: { number: '555-555-5555', sms: false },

          fein: 'fake fein',
          employer_name: 'Jamba Juice',
          is_full_time: true,
          is_imported: true,
          imported_address: {
            employerAddressLine1: 'Building 1',
            employerAddressLine2: ' Really long name',
            employerAddressLine3: '123 main street',
            employerAddressLine4: undefined,
            employerAddressLine5: 'Smallville, KS',
            employerAddressZip: '12345',
          },
          worked_for_imported_employer_in_last_18mo: true,
          separation_circumstance: 'laid_off',
          expect_to_be_recalled: false,
          separation_circumstance_details: undefined,
          employment_start_date: '2021-12-12',
          employment_last_date: '2022-12-12',
          reason_still_employed: undefined,
          hours_reduced_twenty_percent: undefined,
          discharge_date: undefined,
          definite_recall: undefined,
          definite_recall_date: undefined,
          is_seasonal_work: true,

          worked_at_employer_address: true,
          alternate_physical_work_address: undefined,
          is_employer_phone_accurate: true,
          work_location_phone: undefined,

          self_employed: true,
          is_owner: true,
          corporate_officer_or_stock_ownership: true,
          employer_is_sole_proprietorship: undefined,
          related_to_owner_or_child_of_owner_under_18: undefined,

          payments_received: [
            {
              pay_type: 'none',
            },
          ],
        },
      ],
    }

    const {
      importedEmployerAddress,
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
    } = renderEmployerReview(values)
    //verified fields
    expect(importedEmployerAddress[0]).toHaveTextContent(
      `Building 1 Really long name 123 main street Smallville, KS 12345`
    )
    expect(phoneNumber[0]).toHaveTextContent(
      values.employers[0].employer_phone.number
    )
    expect(fein[0]).toHaveTextContent(values.employers[0].fein)
    //your employer
    expect(isFullTimePartTime).toHaveTextContent('yes')
    //work location
    expect(workedAtAddress).toHaveTextContent('yes')
    expect(altAddress.length).toBe(0)
    expect(accuratePhoneNumber).toHaveTextContent('yes')
    expect(altPhone.length).toBe(0)
    //business interests
    expect(selfEmployed).toHaveTextContent('yes')
    expect(isOwner).toHaveTextContent('yes')
    expect(coporateOfficerOrStockerOwnership[0]).toHaveTextContent('yes')
    expect(isSoleProprietorship.length).toBe(0)
    expect(relatedToOwner.length).toBe(0)
  })
  it('shows conditional values for Work location, Business interests and recall', () => {
    const values = {
      employers: [
        {
          mployer_address: undefined,
          employer_phone: { number: '555-555-5555', sms: false },

          fein: 'fake fein',
          employer_name: 'Jamba Juice',
          is_full_time: true,
          is_imported: true,
          imported_address: {
            employerAddressLine1: 'Building 1',
            employerAddressLine2: ' Really long name',
            employerAddressLine3: '123 main street',
            employerAddressLine4: undefined,
            employerAddressLine5: 'Smallville, KS',
            employerAddressZip: '12345',
          },
          worked_for_imported_employer_in_last_18mo: true,
          separation_circumstance: 'laid_off',
          expect_to_be_recalled: false,
          separation_circumstance_details: undefined,
          employment_start_date: '2021-12-12',
          employment_last_date: '2022-12-12',
          reason_still_employed: undefined,
          hours_reduced_twenty_percent: undefined,
          discharge_date: undefined,
          definite_recall: undefined,
          definite_recall_date: undefined,
          is_seasonal_work: true,

          worked_at_employer_address: false,
          alternate_physical_work_address: {
            city: 'I am a city',
            state: 'CA',
            zipcode: '12345',
          },
          is_employer_phone_accurate: false,
          work_location_phone: { number: '1234567890' },

          self_employed: true,
          is_owner: true,
          corporate_officer_or_stock_ownership: false,
          employer_is_sole_proprietorship: false,
          related_to_owner_or_child_of_owner_under_18: 'parent',

          payments_received: [
            {
              pay_type: 'none',
            },
          ],
        },
      ],
    }

    const {
      workedAtAddress,
      altAddress,
      accuratePhoneNumber,
      altPhone,

      coporateOfficerOrStockerOwnership,
      isSoleProprietorship,
      relatedToOwner,
    } = renderEmployerReview(values)
    //work location
    expect(workedAtAddress).toHaveTextContent('no')
    expect(altAddress[0]).toHaveTextContent(
      `${values.employers[0].alternate_physical_work_address.city}, ${values.employers[0].alternate_physical_work_address.state} ${values.employers[0].alternate_physical_work_address.zipcode}`
    )
    expect(accuratePhoneNumber).toHaveTextContent('no')
    expect(altPhone[0]).toHaveTextContent('123-456-7890')

    //business interests
    expect(coporateOfficerOrStockerOwnership[0]).toHaveTextContent('no')
    expect(isSoleProprietorship[0]).toHaveTextContent('no')
    expect(relatedToOwner[0]).toHaveTextContent(
      'business_interests.related_to_owner_or_child_of_owner_under_18.options.parent.label'
    )
  })
})
