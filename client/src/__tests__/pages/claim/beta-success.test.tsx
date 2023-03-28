jest.mock('next-auth/react')

import { render, screen } from '@testing-library/react'
import BetaSuccess from 'pages/claim/beta-success'
import { useSession } from 'next-auth/react'

const mockUseSession = useSession as jest.Mock

describe('success page', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: 'mocked@example.com',
        },
      },
    })
  })

  it('renders link to verify through ID.me', () => {
    render(<BetaSuccess />)

    expect(screen.getByTestId('id.me link')).toBeInTheDocument()
  })
})
