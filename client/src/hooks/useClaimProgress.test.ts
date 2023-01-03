import { renderHook, waitFor } from '@testing-library/react'
import { ClaimantInput, Employer } from 'types/claimantInput'

jest.mock('next-auth/react')
import React from 'react'
import { isEmployerArrayValid, useClaimProgress } from 'hooks/useClaimProgress'
import { Routes } from 'constants/routes'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { RecentEmployersPageDefinition } from 'constants/pages/definitions/recentEmployersPageDefinition'

const mockUseContext = jest.fn()

React.useContext = mockUseContext

const employer: Employer = {
  employer_name: 'Lyft Inc.',
  is_imported: true,
  is_full_time: true,
  is_employer: true,
  payments_received: [
    {
      pay_type: 'none',
    },
  ],
  LOCAL_pay_types: ['none'],
  employment_start_date: '2021-12-12',
  employer_address: {
    address: '1 John Fitch Plaza',
    city: 'Trenton',
    state: 'NJ',
    zipcode: '11111',
  },
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

  describe('isEmployerArrayValid', () => {
    it('is invalid if the recent-employer page is not valid', () => {
      const values = {
        employers: [
          {
            ...employer,
            ...{ is_employer: undefined, is_imported: true },
          },
        ],
      }

      expect(
        isEmployerArrayValid(RecentEmployersPageDefinition, values)
      ).toBeFalsy()
    })

    it('is invalid if there is an employer that has not been filled out yet', () => {
      const values = {
        employers: [
          {
            ...employer,
            ...{
              is_employer: undefined,
              is_imported: true,
              employer_name: undefined,
            },
          },
        ],
      }

      expect(
        isEmployerArrayValid(RecentEmployersPageDefinition, values)
      ).toBeFalsy()
    })

    it('is valid if none of the employers in the employer array are actually employers', () => {
      const values = {
        employers: [
          {
            ...employer,
            ...{
              is_employer: false,
              is_imported: true,
              employer_name: undefined,
            },
          },
        ],
      }

      expect(
        isEmployerArrayValid(RecentEmployersPageDefinition, values)
      ).toBeTruthy()
    })

    it('is valid if all employers in the array are filled out correctly', () => {
      const values = {
        employers: [
          {
            ...employer,
            ...{ is_employer: true, is_imported: true },
          },
        ],
      }

      expect(
        isEmployerArrayValid(RecentEmployersPageDefinition, values)
      ).toBeTruthy()
    })
  })
})
