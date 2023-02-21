import { render, screen } from '@testing-library/react'
import { UnionReview } from './UnionReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'

describe('UnionReview component', () => {
  const renderUnionReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <UnionReview />
      </ClaimFormContext.Provider>
    )

    const requiredThroughHiringHall = screen.queryAllByRole('group', {
      name: 'union.required_to_seek_work_through_hiring_hall.label',
    })
    const unionName = screen.queryAllByRole('group', {
      name: 'union.union_name.label',
    })
    const unionNumber = screen.queryAllByRole('group', {
      name: 'union.union_local_number.label',
    })

    return {
      requiredThroughHiringHall,
      unionName,
      unionNumber,
    }
  }

  it('renders correctly', () => {
    const values = {
      required_to_seek_work_through_hiring_hall: true,
      union_name: 'Software Engineering Union',
      union_local_number: '123',
    }

    const { requiredThroughHiringHall, unionName, unionNumber } =
      renderUnionReview(values)

    expect(requiredThroughHiringHall[0]).toHaveTextContent('yes')
    expect(unionName[0]).toHaveTextContent(values.union_name)
    expect(unionNumber[0]).toHaveTextContent(values.union_local_number)
  })

  it('does not render union name or number correctly if user answers "no" to hiring hall question', () => {
    const values = {
      required_to_seek_work_through_hiring_hall: false,
    }

    const { requiredThroughHiringHall, unionName, unionNumber } =
      renderUnionReview(values)

    expect(requiredThroughHiringHall[0]).toHaveTextContent('no')
    expect(unionName.length).toBe(0)
    expect(unionNumber.length).toBe(0)
  })
})
