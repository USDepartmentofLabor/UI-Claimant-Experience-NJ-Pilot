import { render, screen } from '@testing-library/react'
import { GoToClaimFormButton } from './GoToClaimFormButton'

const mockUseGetPartialClaim = jest.fn()
jest.mock('queries/useGetPartialClaim', () => ({
  useGetPartialClaim: () => mockUseGetPartialClaim(),
}))
describe('GoToClaimFormButton', () => {
  it('renders has in progress partial claim without error', () => {
    render(
      <GoToClaimFormButton
        partialClaim={mockUseGetPartialClaim}
        hasInProgressClaim={true}
      />
    )

    expect(screen.getByTestId('go-to-claim-form')).toBeInTheDocument()
    expect(screen.getByText('continue_claim_button')).toBeInTheDocument()
  })
  it('renders partial claim without error', () => {
    render(
      <GoToClaimFormButton
        partialClaim={mockUseGetPartialClaim}
        hasInProgressClaim={false}
      />
    )

    expect(screen.getByTestId('go-to-claim-form')).toBeInTheDocument()
    expect(screen.getByText('file_a_claim_button')).toBeInTheDocument()
  })
  it('renders no claim in progress without error', () => {
    render(
      <GoToClaimFormButton
        partialClaim={undefined}
        hasInProgressClaim={false}
      />
    )

    expect(screen.getByTestId('go-to-claim-form')).toBeInTheDocument()
    expect(screen.getByText('screener_button')).toBeInTheDocument()
  })
  //TODO: create tests that confirm the correct route is called when button is clicked
})
