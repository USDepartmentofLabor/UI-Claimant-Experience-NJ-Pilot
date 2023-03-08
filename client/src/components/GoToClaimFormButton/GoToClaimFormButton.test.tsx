import { render, screen } from '@testing-library/react'
import { GoToClaimFormButton } from './GoToClaimFormButton'
import userEvent from '@testing-library/user-event'
import { Routes } from '../../constants/routes'

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))
const mockUseGetPartialClaim = jest.fn()
jest.mock('queries/useGetPartialClaim', () => ({
  useGetPartialClaim: () => mockUseGetPartialClaim(),
}))
const mockRouter = jest.fn()
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
})
