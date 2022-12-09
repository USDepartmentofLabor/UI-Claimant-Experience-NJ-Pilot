import { renderHook } from '@testing-library/react-hooks'
import { ClaimantInput } from 'types/claimantInput'

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

  const { result, waitFor } = renderHook(() => useSaveClaimFormValues())
  await waitFor(() => !!result.current.appendAndSaveClaimFormValues)
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
})
