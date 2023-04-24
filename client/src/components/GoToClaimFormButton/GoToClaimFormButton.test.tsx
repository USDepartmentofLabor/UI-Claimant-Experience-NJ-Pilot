import { render, screen } from '@testing-library/react'
import { GoToClaimFormButton } from './GoToClaimFormButton'
import React from 'react'
import { ClaimantInput } from '../../types/claimantInput'
import { Routes } from '../../constants/routes'
import userEvent from '@testing-library/user-event'

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

const mockUseContext = jest.fn()

React.useContext = mockUseContext

const initialValues: ClaimantInput = {
  ssn: '123456789',
}

describe('GoToClaimFormButton', () => {
  it('renders has in progress partial claim without error', () => {
    mockUseContext.mockImplementation(() => ({
      claimFormValues: initialValues,
    }))
    render(<GoToClaimFormButton />)

    expect(screen.getByTestId('go-to-claim-form')).toBeInTheDocument()
    expect(screen.getByText('continue_to_screener_button')).toBeInTheDocument()
  })

  it('renders no claim in progress without error', () => {
    mockUseContext.mockImplementation(() => ({
      claimFormValues: undefined,
    }))
    render(<GoToClaimFormButton />)

    expect(screen.getByTestId('go-to-claim-form')).toBeInTheDocument()
    expect(
      screen.getByText('continue_to_get_ssn_button_name')
    ).toBeInTheDocument()
  })

  it('clicking button navigates properly with ssn', async () => {
    const user = userEvent.setup()
    mockUseContext.mockImplementation(() => ({
      claimFormValues: initialValues,
    }))
    render(<GoToClaimFormButton />)

    const continueButton = screen.getByText('continue_to_screener_button')
    continueButton && (await user.click(continueButton))

    expect(mockPush).toHaveBeenCalledWith(Routes.SCREENER)
  })

  it('clicking button navigates properly without ssn', async () => {
    const user = userEvent.setup()
    mockUseContext.mockImplementation(() => ({
      claimFormValues: undefined,
    }))
    render(<GoToClaimFormButton />)

    const continueButton = screen.getByText('continue_to_get_ssn_button_name')
    continueButton && (await user.click(continueButton))

    expect(mockPush).toHaveBeenCalledWith(Routes.SCREENER)
  })
})
