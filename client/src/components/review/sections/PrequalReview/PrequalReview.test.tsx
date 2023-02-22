import { render, screen } from '@testing-library/react'
import { PrequalReview } from 'components/review/sections/PrequalReview/PrequalReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'

describe('PrequalReview component', () => {
  const renderPrequalReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <PrequalReview />
      </ClaimFormContext.Provider>
    )

    const filedInLast12Mo = screen.queryByRole('group', {
      name: 'prequal.filed_in_last_12mo.label',
    })
    const stateProvinceTerritoryWhereFiled = screen.queryByRole('group', {
      name: 'prequal.state_province_territory_where_filed.label',
    })
    const livedOutsideNjWhenWorkingNj = screen.queryByRole('group', {
      name: 'prequal.lived_outside_nj_when_working_nj.label',
    })
    const willLookForWorkInNj = screen.queryByRole('group', {
      name: 'prequal.will_look_for_work_in_nj.label',
    })
    const canBeginWorkImmediately = screen.queryByRole('group', {
      name: 'prequal.can_begin_work_immediately.label',
    })

    return {
      filedInLast12Mo,
      stateProvinceTerritoryWhereFiled,
      livedOutsideNjWhenWorkingNj,
      willLookForWorkInNj,
      canBeginWorkImmediately,
    }
  }

  it('renders correctly', () => {
    const values = {
      filed_in_last_12mo: true,
      state_province_territory_where_filed: 'Alabama',
      lived_outside_nj_when_working_nj: true,
      will_look_for_work_in_nj: true,
      can_begin_work_immediately: true,
    }

    const {
      filedInLast12Mo,
      stateProvinceTerritoryWhereFiled,
      livedOutsideNjWhenWorkingNj,
      willLookForWorkInNj,
      canBeginWorkImmediately,
    } = renderPrequalReview(values)

    expect(filedInLast12Mo).toHaveTextContent('yes')
    expect(stateProvinceTerritoryWhereFiled).toHaveTextContent(
      values.state_province_territory_where_filed
    )
    expect(livedOutsideNjWhenWorkingNj).toHaveTextContent('yes')
    expect(willLookForWorkInNj).toHaveTextContent('yes')
    expect(canBeginWorkImmediately).toHaveTextContent('yes')
  })

  it('hide `state/province/territory` and `will continue looking for work in NJ` based on answers', () => {
    const values: ClaimantInput = {
      filed_in_last_12mo: false,
      lived_outside_nj_when_working_nj: false,
    }

    const {
      filedInLast12Mo,
      stateProvinceTerritoryWhereFiled,
      livedOutsideNjWhenWorkingNj,
    } = renderPrequalReview(values)

    expect(filedInLast12Mo).toHaveTextContent('no')
    expect(stateProvinceTerritoryWhereFiled).not.toBeInTheDocument()
    expect(livedOutsideNjWhenWorkingNj).toHaveTextContent('no')
  })
})
