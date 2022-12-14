import { render, screen } from '@testing-library/react'
import { ClaimFormSideNav } from 'components/form/ClaimFormSideNav/ClaimFormSideNav'
import userEvent from '@testing-library/user-event'
import { pageDefinitions } from 'constants/pages/pageDefinitions'

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next-auth/react')

const mockUseClaimProgress = jest.fn()
jest.mock('hooks/useClaimProgress', () => ({
  useClaimProgress: () => mockUseClaimProgress(),
}))

describe('ClaimFormSideNav', () => {
  const firstPageDefinition = pageDefinitions[0]
  const middlePageDefinition = pageDefinitions[1]

  it('renders properly', async () => {
    mockUseClaimProgress.mockImplementation(() => ({
      continuePath: firstPageDefinition.path,
    }))

    render(
      <ClaimFormSideNav index={pageDefinitions.indexOf(firstPageDefinition)} />
    )

    const firstPageLink = screen.queryByText(firstPageDefinition.heading)

    expect(firstPageLink).toBeInTheDocument()
  })

  it('pushes the link in the page definition and formik state when a link is pressed', async () => {
    mockUseClaimProgress.mockImplementation(() => ({
      continuePath: middlePageDefinition.path,
    }))

    const user = userEvent.setup()
    render(
      <ClaimFormSideNav index={pageDefinitions.indexOf(middlePageDefinition)} />
    )

    const firstPageLink = screen.getByText(firstPageDefinition.heading)
    await user.click(firstPageLink)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(firstPageDefinition.path)
    )
  })
})
