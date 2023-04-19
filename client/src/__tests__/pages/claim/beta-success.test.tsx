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

  it('renders link to verify through ID.me, and certify', () => {
    render(<BetaSuccess />)

    expect(screen.getByTestId('id-me-link')).toHaveAttribute(
      'href',
      'https://hosted-pages.id.me/njdolverify'
    )
    expect(screen.getByTestId('certify-link')).toHaveAttribute(
      'href',
      'https://lwdlba.state.nj.us/CertQueueMini/employerVerifyForm.htm'
    )
  })
})
