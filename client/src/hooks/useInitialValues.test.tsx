import { renderHook, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'

import { useInitialValues } from 'hooks/useInitialValues'
import { ClaimantInput, WhoAmI } from 'types/claimantInput'
import {
  ClaimFormContext,
  ClaimFormContextType,
} from 'contexts/ClaimFormContext'

jest.mock('next-auth/react')

const mockUseSession = useSession as jest.Mock
mockUseSession.mockImplementation()

const whoAmI: WhoAmI = {
  firstName: 'Hermione',
  lastName: 'Granger',
  birthdate: '2000-12-22',
  email: 'test@example.com',
  phone: '555-555-5555',
}

describe('useInitialValues hook', () => {
  const pageInitialValues: ClaimantInput = {
    alternate_phone: {
      number: '555-555-5555',
      sms: false,
    },
  }

  const claimFormContext: ClaimFormContextType = {
    setClaimFormValues: jest.fn(),
    claimFormValues: {
      sex: 'female',
    },
  }

  it('combines the values passed in as an argument, values from the context (previously saved values), and whoami data', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: 'test@example.com',
        },
        whoAmI,
      },
      status: 'authenticated',
    })

    const { result } = renderHook(() => useInitialValues(pageInitialValues), {
      wrapper: ({ children }: any) => (
        <ClaimFormContext.Provider value={claimFormContext}>
          {children}
        </ClaimFormContext.Provider>
      ),
    })
    await waitFor(() => expect(result.current.isLoading).toEqual(false))

    const { initialValues } = result.current

    // passed in values should be in the initial values
    expect(initialValues.alternate_phone).toEqual(
      pageInitialValues.alternate_phone
    )

    // WhoAmI information should be in the initial values
    expect(initialValues.claimant_name?.first_name).toEqual(whoAmI.firstName)
    expect(initialValues.claimant_name?.last_name).toEqual(whoAmI.lastName)
    expect(initialValues.claimant_name?.middle_initial).toBeUndefined()
    expect(initialValues.birthdate).toEqual(whoAmI.birthdate)
    expect(initialValues.email).toEqual(whoAmI.email)
    expect(initialValues.claimant_phone?.number).toEqual(whoAmI.phone)

    // Values from the ClaimForm context (previously saved values) should be in the initial values
    expect(initialValues.sex).toEqual(claimFormContext.claimFormValues?.sex)
  })
})
