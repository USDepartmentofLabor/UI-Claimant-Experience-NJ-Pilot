import { renderHook } from '@testing-library/react-hooks'
import { ClaimantInput } from 'types/claimantInput'

jest.mock('next-auth/react')
import React from 'react'
import { useClaimProgress } from 'hooks/useClaimProgress'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'

const mockUseContext = jest.fn()

React.useContext = mockUseContext

const initialValues: ClaimantInput = {
  filed_in_last_12mo: undefined,
  state_province_territory_where_filed: undefined,
  lived_outside_nj_when_working_nj: undefined,
  will_look_for_work_in_nj: undefined,
  can_begin_work_immediately: undefined,
  federal_work_in_last_18mo: undefined,
}
describe('should use whoami', () => {
  it('returns the first page if none of the form is filled out', async () => {
    mockUseContext.mockImplementation(() => ({
      claimFormValues: initialValues,
    }))

    const { result, waitFor } = renderHook(() => useClaimProgress())

    await waitFor(() => !!result.current.continuePath)

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
        federal_work_in_last_18mo: true,
      },
    }))

    const { result, waitFor } = renderHook(() => useClaimProgress())

    await waitFor(() => !!result.current.continuePath)

    expect(result.current.continuePath).toEqual(pageDefinitions[1].path)
  })

  it('returns home if there are no claim form values set', async () => {
    mockUseContext.mockImplementation(() => ({
      claimFormValues: undefined,
    }))

    const { result, waitFor } = renderHook(() => useClaimProgress())

    await waitFor(() => !!result.current.continuePath)

    expect(result.current.continuePath).toEqual(Routes.HOME)
  })
})
