import { ClaimantInput } from 'types/claimantInput'

export const useInitialValues = jest.fn((values: ClaimantInput) => ({
  initialValues: values,
  isLoading: false,
}))
