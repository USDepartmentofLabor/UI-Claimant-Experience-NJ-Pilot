import { renderHook, waitFor } from '@testing-library/react'
import { ClaimantInput, Employer } from 'types/claimantInput'

jest.mock('next-auth/react')
import React from 'react'
import {
  areImportedEmployersValid,
  useClaimProgress,
} from 'hooks/useClaimProgress'
import { Routes } from 'constants/routes'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { EMPLOYER_SKELETON } from 'components/form/EditEmployer/EditEmployer'

const mockUseContext = jest.fn()

React.useContext = mockUseContext

const importedEmployer: Employer = {
  ...EMPLOYER_SKELETON,
  employer_name: 'Lyft Inc.',
  is_imported: true,
  is_full_time: true,
  worked_for_imported_employer_in_last_18mo: true,
  payments_received: [
    {
      pay_type: 'none',
      note: '',
      total: '',
      date_pay_began: '',
      date_pay_ended: '',
    },
  ],
  LOCAL_pay_types: ['none'],
  employment_start_date: '2021-12-12',
  imported_address: {
    employerAddressLine1: '1 John Fitch Plaza',
    employerAddressLine2: null,
    employerAddressLine3: null,
    employerAddressLine4: null,
    employerAddressLine5: 'Trenton NJ',
    employerAddressZip: '11111',
  },
  employer_phone: { number: '555-555-5555', sms: null },
  worked_at_employer_address: true,
  is_employer_phone_accurate: true,
  self_employed: false,
  is_owner: false,
  corporate_officer_or_stock_ownership: true,
  expect_to_be_recalled: false,
  separation_circumstance: 'laid_off',
  employment_last_date: '2022-12-03',
}

const initialValues: ClaimantInput = {
  filed_in_last_12mo: undefined,
  state_province_territory_where_filed: undefined,
  lived_outside_nj_when_working_nj: undefined,
  will_look_for_work_in_nj: undefined,
  can_begin_work_immediately: undefined,
}
describe('Claim progress hook', () => {
  it('returns the first page if none of the form is filled out', async () => {
    mockUseContext.mockImplementation(() => ({
      claimFormValues: initialValues,
    }))

    const { result } = await renderHook(() => useClaimProgress())

    await waitFor(() => expect(result.current.continuePath).not.toBeUndefined())

    expect(result.current.continuePath).toEqual(pageDefinitions[0].path)
  })

  it('returns the second page when the initial values have a valid first page', async () => {
    mockUseContext.mockImplementation(() => ({
      claimFormValues: {
        filed_in_last_12mo: true,
        state_province_territory_where_filed: 'NJ',
        lived_outside_nj_when_working_nj: false,
        will_look_for_work_in_nj: true,
        can_begin_work_immediately: true,
      },
    }))

    const { result } = await renderHook(() => useClaimProgress())

    await waitFor(() => expect(result.current.continuePath).not.toBeUndefined())

    expect(result.current.continuePath).toEqual(pageDefinitions[1].path)
  })

  it('returns home if there are no claim form values set', async () => {
    mockUseContext.mockImplementation(() => ({
      claimFormValues: undefined,
    }))

    const { result } = await renderHook(() => useClaimProgress())

    await waitFor(() => expect(result.current.continuePath).not.toBeUndefined())

    expect(result.current.continuePath).toEqual(Routes.HOME)
  })

  describe('areImportedEmployersValid', () => {
    it('is invalid if the recent-employer page is not valid', () => {
      const values = {
        employers: [
          {
            ...importedEmployer,
            ...{
              worked_for_imported_employer_in_last_18mo:
                EMPLOYER_SKELETON.worked_for_imported_employer_in_last_18mo,
              is_imported: true,
            },
          },
        ],
      }

      expect(areImportedEmployersValid(values)).toBeFalsy()
    })

    it('is invalid if there is an employer that has not been filled out yet', () => {
      const values = {
        employers: [
          {
            ...importedEmployer,
            ...{
              worked_for_imported_employer_in_last_18mo:
                EMPLOYER_SKELETON.worked_for_imported_employer_in_last_18mo,
              is_imported: true,
              employer_name: EMPLOYER_SKELETON.employer_name,
            },
          },
        ],
      }

      expect(areImportedEmployersValid(values)).toBeFalsy()
    })

    it('is valid if none of the employers in the employer array are actually employers', () => {
      const values = {
        employers: [
          {
            ...importedEmployer,
            ...{
              worked_for_imported_employer_in_last_18mo: false,
              is_imported: true,
              employer_name: EMPLOYER_SKELETON.employer_name,
            },
          },
        ],
      }

      expect(areImportedEmployersValid(values)).toBeTruthy()
    })

    it('is valid if all employers in the array are filled out correctly', () => {
      const values = {
        employers: [
          {
            ...importedEmployer,
            ...{
              worked_for_imported_employer_in_last_18mo: true,
              is_imported: true,
            },
          },
        ],
      }

      expect(areImportedEmployersValid(values)).toBeTruthy()
    })
  })
})
