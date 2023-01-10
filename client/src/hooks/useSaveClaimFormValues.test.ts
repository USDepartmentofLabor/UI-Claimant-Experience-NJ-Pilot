import { ClaimantInput, Employer } from 'types/claimantInput'
import { renderHook, waitFor } from '@testing-library/react'

jest.mock('next-auth/react')
import React from 'react'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'

const mockUseContext = jest.fn()

let mockClaimFormValues: ClaimantInput = { ssn: '000000000' }
const mockSetClaimFormValues = jest.fn()
mockSetClaimFormValues.mockImplementation((values: ClaimantInput) => {
  mockClaimFormValues = values
})

mockUseContext.mockImplementation(() => ({
  claimFormValues: mockClaimFormValues,
  setClaimFormValues: (values: ClaimantInput) => mockSetClaimFormValues(values),
}))

React.useContext = mockUseContext

const mockSaveCompleteClaimReset = jest.fn()
const mockUseSaveCompleteClaim = jest.fn().mockImplementation(() => ({
  reset: () => mockSaveCompleteClaimReset(),
}))
jest.mock('queries/useSaveCompleteClaim', () => ({
  useSaveCompleteClaim: () => mockUseSaveCompleteClaim(),
}))

const mockSubmitClaimReset = jest.fn()
const mockUseSubmitClaim = jest.fn().mockImplementation(() => ({
  reset: () => mockSubmitClaimReset(),
}))
jest.mock('queries/useSubmitClaim', () => ({
  useSubmitClaim: () => mockUseSubmitClaim(),
}))

const mockUseSavePartialClaim = jest.fn()
jest.mock('queries/useSavePartialClaim', () => ({
  useSavePartialClaim: () => mockUseSavePartialClaim(),
}))

const setUpHook = async (status: number) => {
  const mockMutateAsync = jest.fn()
  mockMutateAsync.mockImplementation(async () => ({
    status: status,
  }))
  mockUseSavePartialClaim.mockImplementation(() => ({
    mutateAsync: async (values: ClaimantInput) => mockMutateAsync(values),
  }))

  const { result } = renderHook(() => useSaveClaimFormValues())
  await waitFor(() =>
    expect(result.current.appendAndSaveClaimFormValues).not.toBeUndefined()
  )
  return { mockMutateAsync, result }
}

describe('it saves the claim form values', () => {
  beforeEach(() => {
    mockClaimFormValues = { ssn: '000000000' }
    jest.clearAllMocks()
  })

  describe('it tries to append and save the form values', () => {
    const input = {
      ssn: '111111111',
      authorized_to_work: true,
    }

    it('And succeeds when a 200 response is returned', async () => {
      const { mockMutateAsync, result } = await setUpHook(200)
      await result.current.appendAndSaveClaimFormValues(input)

      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
      expect(mockSubmitClaimReset).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(input)
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockClaimFormValues).toEqual({
        ssn: '111111111',
        authorized_to_work: true,
      })
    })

    it('But fails when it receives a response that is not 200', async () => {
      const { mockMutateAsync, result } = await setUpHook(404)
      await result.current.appendAndSaveClaimFormValues(input)

      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
      expect(mockSubmitClaimReset).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(input)
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockClaimFormValues).toEqual({ ssn: '000000000' })
    })
  })
  describe('it tries to delete an element in the employer array and then save this mutation', () => {
    it('deletes the employer in the correct index when a 200 response is received', async () => {
      mockClaimFormValues = {
        ssn: '000000000',
        employers: [
          {
            employer_name: 'Apple',
            LOCAL_pay_types: [],
            payments_received: [],
          },
          {
            employer_name: 'Honda',
            LOCAL_pay_types: [],
            payments_received: [],
          },
        ],
      }

      const expectedClaimFormValues = {
        ssn: '000000000',
        employers: [
          {
            employer_name: 'Honda',
            LOCAL_pay_types: [],
            payments_received: [],
          },
        ],
      }

      const { mockMutateAsync, result } = await setUpHook(200)
      await result.current.deleteEmployerAndSaveClaimFormValues('0')

      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
      expect(mockSubmitClaimReset).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(expectedClaimFormValues)
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
    })
  })

  describe('it tries to modify the employer array and save the claim form values', () => {
    it('inserts the employer in the correct index when a 200 response is received', async () => {
      mockClaimFormValues = {
        ssn: '000000000',
        employers: [
          {
            employer_name: 'Apple',
            LOCAL_pay_types: [],
            payments_received: [],
          },
          {
            employer_name: 'Honda',
            LOCAL_pay_types: [],
            payments_received: [],
          },
        ],
      }
      const expectedClaimFormValues = {
        ssn: '000000000',
        employers: [
          {
            employer_name: 'Apple',
            LOCAL_pay_types: [],
            payments_received: [],
          },
          {
            employer_name: 'Microsoft',
            LOCAL_pay_types: [],
            payments_received: [],
          },
        ],
      }
      const { mockMutateAsync, result } = await setUpHook(200)
      const employer: Employer = {
        employer_name: 'Microsoft',
        LOCAL_pay_types: [],
        payments_received: [],
      }

      const index = '1'

      await result.current.modifyEmployerAndSaveClaimFormValues(employer, index)

      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
      expect(mockSubmitClaimReset).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(expectedClaimFormValues)
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
    })

    it('fails to change the employer when a 404 error is received', async () => {
      mockClaimFormValues = {
        ssn: '000000000',
        employers: [
          {
            employer_name: 'Apple',
            LOCAL_pay_types: [],
            payments_received: [],
          },
          {
            employer_name: 'Honda',
            LOCAL_pay_types: [],
            payments_received: [],
          },
        ],
      }
      const { mockMutateAsync, result } = await setUpHook(404)
      const employer: Employer = {
        employer_name: 'Microsoft',
        LOCAL_pay_types: [],
        payments_received: [],
      }

      const index = '1'

      await result.current.modifyEmployerAndSaveClaimFormValues(employer, index)

      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
      expect(mockSubmitClaimReset).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(mockClaimFormValues)
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
    })

    it('Creates the array and inserts the employer if no employers existed prior', async () => {
      mockClaimFormValues = { ssn: '000000000' }
      const expectedClaimFormValues = {
        ssn: '000000000',
        employers: [
          {
            employer_name: 'Microsoft',
            LOCAL_pay_types: [],
            payments_received: [],
          },
        ],
      }
      const { mockMutateAsync, result } = await setUpHook(200)
      const employer: Employer = {
        employer_name: 'Microsoft',
        LOCAL_pay_types: [],
        payments_received: [],
      }

      const index = '0'

      await result.current.modifyEmployerAndSaveClaimFormValues(employer, index)
      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
      expect(mockSubmitClaimReset).toHaveBeenCalledTimes(1)
      expect(mockMutateAsync).toHaveBeenCalledWith(expectedClaimFormValues)
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
      expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(1)
    })

    describe('it fails to try to save when the index given is invalid', () => {
      it('fails when the index is not 0 when no employers currently exist', async () => {
        mockClaimFormValues = { ssn: '000000000' }
        const { mockMutateAsync, result } = await setUpHook(200)
        const employer: Employer = {
          employer_name: 'Microsoft',
          LOCAL_pay_types: [],
          payments_received: [],
        }

        const index = '1'

        await result.current.modifyEmployerAndSaveClaimFormValues(
          employer,
          index
        )
        expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(0)
        expect(mockSubmitClaimReset).toHaveBeenCalledTimes(0)
        expect(mockMutateAsync).toHaveBeenCalledTimes(0)
        expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(0)
      })

      it('fails when the index given is more than one larger than the current size of the employer index', async () => {
        mockClaimFormValues = {
          ssn: '000000000',
          employers: [
            {
              employer_name: 'Apple',
              LOCAL_pay_types: [],
              payments_received: [],
            },
            {
              employer_name: 'Honda',
              LOCAL_pay_types: [],
              payments_received: [],
            },
          ],
        }
        const { mockMutateAsync, result } = await setUpHook(404)
        const employer: Employer = {
          employer_name: 'Microsoft',
          LOCAL_pay_types: [],
          payments_received: [],
        }

        const index = '3'

        await result.current.modifyEmployerAndSaveClaimFormValues(
          employer,
          index
        )
        expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(0)
        expect(mockSubmitClaimReset).toHaveBeenCalledTimes(0)
        expect(mockMutateAsync).toHaveBeenCalledTimes(0)
        expect(mockSaveCompleteClaimReset).toHaveBeenCalledTimes(0)
      })
    })
  })
})
