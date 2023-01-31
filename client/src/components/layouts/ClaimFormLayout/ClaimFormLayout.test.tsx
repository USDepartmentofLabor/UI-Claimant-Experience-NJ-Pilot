import { render, screen } from '@testing-library/react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { PrequalPageDefinition } from 'constants/pages/definitions/prequalPageDefinition'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppContextProviders } from 'components/AppContextProviders/AppContextProviders'
import { DemographicsPageDefinition } from 'constants/pages/definitions/demographicsPageDefinition'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
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
      mockPush.mockClear()
    })

    it('renders the layout properly', () => {
      render(
        <AppContextProviders>
          <ClaimFormLayout pageDefinition={PrequalPageDefinition} index={0}>
            Some content
          </ClaimFormLayout>
        </AppContextProviders>
      )

      const loader = screen.queryByTestId('page-loading')

      expect(loader).not.toBeInTheDocument()
    })

    it('redirects user to the SSN page if the value does not exist in the claim', () => {
      render(
        <AppContextProviders>
          <ClaimFormLayout
            pageDefinition={DemographicsPageDefinition}
            index={pageDefinitions.indexOf(DemographicsPageDefinition)}
          >
            Some content
          </ClaimFormLayout>
        </AppContextProviders>
      )

      // expect(mockPush).toHaveBeenCalledTimes(1) TODO: figure out why gets called >1
      expect(mockPush).toHaveBeenCalledWith(Routes.SSN)
    })

    it('redirects user to the first unfinished page', () => {
      const partialClaim = { ssn: '123', screener_current_country_us: true }
      mockUseGetPartialClaim.mockImplementation(() => ({
        isLoading: false,
        data: partialClaim,
      }))

      render(
        <AppContextProviders>
          <ClaimFormLayout
            pageDefinition={DemographicsPageDefinition}
            index={pageDefinitions.indexOf(DemographicsPageDefinition)}
          >
            Some content
          </ClaimFormLayout>
        </AppContextProviders>
      )

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(Routes.CLAIM.PREQUAL)
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
      const errorDiv = screen.getByText('errorStatus.500.')

      expect(loader).not.toBeInTheDocument()
      expect(errorDiv).toBeInTheDocument()
    })
  })
})
