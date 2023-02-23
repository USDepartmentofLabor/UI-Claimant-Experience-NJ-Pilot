import { render, screen } from '@testing-library/react'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { DisabilityReview } from './DisabilityReview'
import { DisabilityPaymentTypeOption } from 'constants/formOptions'
import { formatStoredDateToDisplayDate } from 'utils/date/format'

describe('DisabilityReview component', () => {
  const renderDisabilityReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <DisabilityReview />
      </ClaimFormContext.Provider>
    )

    const disabilityAppliedOrReceived = screen.queryAllByRole('group', {
      name: 'disability.disability_applied_to_or_received.label',
    })
    const disabledImmediatelyBefore = screen.queryAllByRole('group', {
      name: 'disability.disabled_immediately_before.label',
    })
    const dateDisabilityBegan = screen.queryAllByRole('group', {
      name: 'disability.date_disability_began.label',
    })
    const recoveryDate = screen.queryAllByRole('group', {
      name: 'disability.recovery_date.label',
    })
    const contactedLastEmployer = screen.queryAllByRole('group', {
      name: 'disability.contacted_last_employer_after_recovery.label',
    })
    return {
      disabilityAppliedOrReceived,
      disabledImmediatelyBefore,
      dateDisabilityBegan,
      recoveryDate,
      contactedLastEmployer,
    }
  }

  it('renders correctly', () => {
    const values: ClaimantInput = {
      disabled_immediately_before: true,
      type_of_disability: 'private_plan',
      date_disability_began: '2022-04-01',
      recovery_date: '2022-04-01',
      contacted_last_employer_after_recovery: true,
      disability_applied_to_or_received: [
        'none' as DisabilityPaymentTypeOption,
      ],
    }

    const {
      disabilityAppliedOrReceived,
      disabledImmediatelyBefore,
      dateDisabilityBegan,
      recoveryDate,
      contactedLastEmployer,
    } = renderDisabilityReview(values)
    screen.debug()
    expect(disabilityAppliedOrReceived[0]).toHaveTextContent('none')
    expect(disabledImmediatelyBefore[0]).toHaveTextContent('yes')
    expect(dateDisabilityBegan[0]).toHaveTextContent(
      formatStoredDateToDisplayDate('2022-04-01') as string
    )
    expect(recoveryDate[0]).toHaveTextContent(
      formatStoredDateToDisplayDate('2022-04-01') as string
    )
    expect(contactedLastEmployer[0]).toHaveTextContent('yes')
  })

  it('shows all disability types', () => {
    const values: ClaimantInput = {
      disabled_immediately_before: true,
      type_of_disability: 'private_plan',
      date_disability_began: '2022-04-01',
      recovery_date: '2022-04-01',
      contacted_last_employer_after_recovery: true,
      disability_applied_to_or_received: [
        'disability',
        'family_leave',
        'social_security',
      ],
    }

    const { disabilityAppliedOrReceived } = renderDisabilityReview(values)
    expect(disabilityAppliedOrReceived[0].textContent).toMatch(
      'disability.disability'
    )
    expect(disabilityAppliedOrReceived[0].textContent).toMatch('family_leave')
    expect(disabilityAppliedOrReceived[0].textContent).toMatch(
      'social_security'
    )
  })
})
