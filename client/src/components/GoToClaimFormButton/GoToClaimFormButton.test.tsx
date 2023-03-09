import { render, screen } from '@testing-library/react'
import { GoToClaimFormButton } from './GoToClaimFormButton'
import React from 'react'
import { ClaimantInput } from '../../types/claimantInput'

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
})
