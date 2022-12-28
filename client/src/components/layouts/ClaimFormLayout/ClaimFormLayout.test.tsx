import { render, screen } from '@testing-library/react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { PrequalPageDefinition } from 'constants/pages/definitions/prequalPageDefinition'
import { QueryClient, QueryClientProvider } from 'react-query'

const mockPush = jest.fn(async () => true)
const mockUseRouter = jest.fn(() => ({
  push: mockPush,
}))
jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter,
}))

const mockUseGetPartialClaim = jest.fn()
jest.mock('queries/useGetPartialClaim', () => ({
  useGetPartialClaim: () => mockUseGetPartialClaim(),
}))

describe('ClaimFormLayout', () => {
  describe('the rendered state', () => {
    beforeEach(() => {
      const emptyPartialClaim = {}
      mockUseGetPartialClaim.mockImplementation(() => ({
        isLoading: false,
        data: emptyPartialClaim,
      }))
    })

    it('renders the layout properly', () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <ClaimFormLayout pageDefinition={PrequalPageDefinition} index={0}>
            Some content
          </ClaimFormLayout>
        </QueryClientProvider>
      )

      const loader = screen.queryByTestId('page-loading')

      expect(loader).not.toBeInTheDocument()
    })
  })

  describe('the loading state', () => {
    beforeEach(() => {
      mockUseGetPartialClaim.mockImplementation(() => ({
        isLoading: true,
      }))
    })
    it('renders a loader while loading', () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <ClaimFormLayout pageDefinition={PrequalPageDefinition} index={0}>
            Some content
          </ClaimFormLayout>
        </QueryClientProvider>
      )

      const loader = screen.queryByTestId('page-loading')

      expect(loader).toBeInTheDocument()
    })
  })

  describe('the error state', () => {
    beforeEach(() => {
      mockUseGetPartialClaim.mockImplementation(() => ({
        isLoading: false,
        isError: true,
      }))
    })
    it('renders a 500 error when loading finishes with an error', () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <ClaimFormLayout pageDefinition={PrequalPageDefinition} index={0}>
            Some content
          </ClaimFormLayout>
        </QueryClientProvider>
      )

      const loader = screen.queryByTestId('page-loading')
      const errorDiv = screen.getByText('Internal Server Error.')

      expect(loader).not.toBeInTheDocument()
      expect(errorDiv).toBeInTheDocument()
    })
  })
})
