import { ReviewReportSections } from 'components/review/ReviewReport/ReviewReport'
import { SuffixOption } from 'constants/formOptions'
import { render, screen } from '@testing-library/react'
import { ClaimFormContextType } from 'contexts/ClaimFormContext'

describe('ReviewReport component', () => {
  const renderReviewSections = (
    reviewData: JSX.IntrinsicAttributes & ClaimFormContextType
  ) => {
    render(<ReviewReportSections {...reviewData} />)

    const first_name = screen.queryByRole('group', {
      name: 'name.first_name.label',
    })
    const middle_initial = screen.queryByRole('group', {
      name: 'name.middle_initial.label',
    })
    const last_name = screen.queryByRole('group', {
      name: 'name.last_name.label',
    })
    const suffix = screen.queryByRole('group', {
      name: 'name.suffix.label',
    })
    const ssn = screen.queryAllByRole('group', {
      name: 'label',
    })
    return {
      first_name,
      middle_initial,
      last_name,
      suffix,
      ssn,
    }
  }
  it('renders sections with data correctly', () => {
    const reviewData = {
      claimFormValues: {
        claimant_name: {
          first_name: 'Darlene',
          middle_initial: 'F',
          last_name: 'Fugazi',
          suffix: 'I' as SuffixOption,
        },
        ssn: '111-22-3333',
      },
      setClaimFormValues: jest.fn(),
      maskSensitiveData: false,
    }
    const { first_name, middle_initial, last_name, suffix, ssn } =
      renderReviewSections(reviewData)

    expect(first_name).toHaveTextContent(
      reviewData.claimFormValues.claimant_name.first_name
    )
    expect(middle_initial).toHaveTextContent(
      reviewData.claimFormValues.claimant_name.middle_initial
    )
    expect(last_name).toHaveTextContent(
      reviewData.claimFormValues.claimant_name.last_name
    )
    expect(suffix).toHaveTextContent(
      reviewData.claimFormValues.claimant_name.suffix
    )
    expect(ssn[0]).toHaveTextContent(reviewData.claimFormValues.ssn)
  })
})
