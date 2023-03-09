import { render, screen } from '@testing-library/react'
import { DevHome } from './DevHome'
jest.mock('next-auth/react')
import { useSession } from 'next-auth/react'

const mockUseSession = useSession as jest.Mock
const mockUseGetPartialClaim = jest.fn()
jest.mock('queries/useGetPartialClaim', () => ({
  useGetPartialClaim: () => mockUseGetPartialClaim(),
}))

const whoAmI = {
  firstName: 'ChetFaker',
  middleInitial: undefined,
  lastName: 'ChetFaker',
  birthdate: '1990-01-01',
  email: 'chetfaker@chetsfakedomain.com',
  phone: '5555555555',
}
describe('DevHome', () => {
  it('renders without error', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
        },
        whoAmI,
      },
      status: 'authenticated',
    })
    render(<DevHome setClaimStatus={''} />)
    expect(screen.getByText('Signed in as:'))
    expect(screen.getByText('email'))
  })
})
