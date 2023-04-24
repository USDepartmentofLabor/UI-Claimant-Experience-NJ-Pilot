import { renderHook, waitFor } from '@testing-library/react'
import { useWhoAmI } from 'hooks/useWhoAmI'
import { WhoAmI } from 'types/claimantInput'

jest.mock('next-auth/react')
import { useSession } from 'next-auth/react'
const mockUseSession = useSession as jest.Mock

const whoAmI: WhoAmI = {
  firstName: 'Hermione',
  lastName: 'Granger',
  birthdate: '2000-12-22',
  email: 'test@example.com',
  phone: '555-555-5555',
}

describe('should use whoami', () => {
  it('calls the query and returns the expected data', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
        },
        whoAmI,
      },
      status: 'authenticated',
    })
    const { result } = renderHook(() => useWhoAmI())

    await waitFor(() => expect(result.current.isLoading).toEqual(false))

    expect(mockUseSession).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(whoAmI)
  })
})
