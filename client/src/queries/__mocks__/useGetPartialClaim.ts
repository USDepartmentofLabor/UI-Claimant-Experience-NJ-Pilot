const emptyClaimFormData = {}
export const useGetPartialClaim = jest.fn(() => {
  return {
    isLoading: false,
    data: emptyClaimFormData,
  }
})
