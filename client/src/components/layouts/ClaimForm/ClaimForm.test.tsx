import { render, screen } from '@testing-library/react'
import { ClaimForm } from 'components/layouts/ClaimForm/ClaimForm'
import { makeClaimFormRoute, Routes } from 'constants/routes'
import userEvent from '@testing-library/user-event'

const useRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => useRouter(),
}))
jest.mock('constants/pages/pageDefinitions')

describe('ClaimForm Layout', () => {
  const FirstPage = () => <div>First Page!</div>
  const MiddlePage = () => <div>Middle Page!</div>
  const LastPage = () => <div>Last Page!</div>

  describe('first page', () => {
    it('renders properly with next page button', async () => {
      useRouter.mockImplementation(() => ({
        pathname: makeClaimFormRoute('first'),
      }))
      render(
        <ClaimForm>
          <FirstPage />
        </ClaimForm>
      )

      await screen.findByText('First Page!')

      const previousPageButton = screen.queryByText('pagination.previous')
      const nextButton = screen.queryByText('pagination.next')
      const saveAndExitLink = screen.queryByText('pagination.save_and_exit')

      expect(previousPageButton).not.toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
      expect(saveAndExitLink).toBeInTheDocument()
    })

    it('clicking next navigates to the next page', async () => {
      const user = userEvent.setup()
      const firstPageRoute = makeClaimFormRoute('first')
      const middlePageRoute = makeClaimFormRoute('middle')
      const mockGetPathName = jest.fn(() => firstPageRoute)
      const mockPush = jest.fn(async () => true)
      useRouter.mockImplementation(() => ({
        pathname: mockGetPathName(),
        push: mockPush,
      }))

      render(
        <ClaimForm>
          <FirstPage />
        </ClaimForm>
      )

      await screen.findByText('First Page!')
      const nextButton = screen.getByText('pagination.next')

      expect(mockGetPathName).toHaveBeenCalledTimes(1)
      expect(nextButton).toBeInTheDocument()

      await user.click(nextButton)

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(middlePageRoute)
    })
  })

  describe('middle pages', () => {
    it('render properly with previous and next page buttons', async () => {
      useRouter.mockImplementation(() => ({
        pathname: makeClaimFormRoute('middle'),
      }))
      render(
        <ClaimForm>
          <MiddlePage />
        </ClaimForm>
      )

      await screen.findByText('Middle Page!')

      const previousButton = screen.queryByText('pagination.previous')
      const nextButton = screen.queryByText('pagination.next')
      const saveAndExitLink = screen.queryByText('pagination.save_and_exit')

      expect(previousButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
      expect(saveAndExitLink).toBeInTheDocument()
    })

    it('clicking previous navigates to the previous page', async () => {
      const user = userEvent.setup()
      const firstPageRoute = makeClaimFormRoute('first')
      const middlePageRoute = makeClaimFormRoute('middle')
      const mockGetPathName = jest.fn(() => middlePageRoute)
      const mockPush = jest.fn(async () => true)
      useRouter.mockImplementation(() => ({
        pathname: mockGetPathName(),
        push: mockPush,
      }))

      render(
        <ClaimForm>
          <MiddlePage />
        </ClaimForm>
      )

      await screen.findByText('Middle Page!')
      const previousButton = screen.getByText('pagination.previous')

      expect(mockGetPathName).toHaveBeenCalledTimes(1)
      expect(previousButton).toBeInTheDocument()

      await user.click(previousButton)

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(firstPageRoute)
    })
  })

  describe('last page', () => {
    it('renders with a previous and submit button properly', async () => {
      useRouter.mockImplementation(() => ({
        pathname: makeClaimFormRoute('last'),
      }))
      render(
        <ClaimForm>
          <LastPage />
        </ClaimForm>
      )

      await screen.findByText('Last Page!')

      const previousButton = screen.queryByText('pagination.previous')
      const nextButton = screen.queryByText('pagination.next')
      const completeButton = screen.queryByText('pagination.complete')
      const saveAndExitLink = screen.queryByText('pagination.save_and_exit')

      expect(previousButton).toBeInTheDocument()
      expect(nextButton).not.toBeInTheDocument()
      expect(completeButton).toBeInTheDocument()
      expect(saveAndExitLink).toBeInTheDocument()
    })

    it('clicking submit navigates home', async () => {
      const user = userEvent.setup()
      const mockGetPathName = jest.fn(() => makeClaimFormRoute('last'))
      const mockPush = jest.fn(async () => true)
      useRouter.mockImplementation(() => ({
        pathname: mockGetPathName(),
        push: mockPush,
      }))

      render(
        <ClaimForm>
          <LastPage />
        </ClaimForm>
      )

      await screen.findByText('Last Page!')
      const completeButton = screen.getByText('pagination.complete')

      expect(mockGetPathName).toHaveBeenCalledTimes(1)
      expect(completeButton).toBeInTheDocument()

      await user.click(completeButton)

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(Routes.HOME)
    })
  })

  it('renders an alert if there is no page definition for the given route', async () => {
    useRouter.mockImplementation(() => ({
      pathname: '/not-real',
    }))
    render(
      <ClaimForm>
        <div>Page without definition</div>
      </ClaimForm>
    )

    const previousPageButton = screen.queryByText('pagination.previous')
    const nextButton = screen.queryByText('pagination.next')
    const completeButton = screen.queryByText('pagination.complete')
    const saveAndExitLink = screen.queryByText('pagination.save_and_exit')
    const missingDefinitionAlert = screen.queryByTestId(
      'missing-page-definition-alert'
    )

    expect(previousPageButton).not.toBeInTheDocument()
    expect(nextButton).not.toBeInTheDocument()
    expect(completeButton).not.toBeInTheDocument()
    expect(saveAndExitLink).not.toBeInTheDocument()
    expect(missingDefinitionAlert).toBeInTheDocument()
  })

  it('clicking "save and exit" navigates home', async () => {
    const user = userEvent.setup()
    const mockGetPathName = jest.fn(() => makeClaimFormRoute('middle'))
    const mockPush = jest.fn(async () => true)
    useRouter.mockImplementation(() => ({
      pathname: mockGetPathName(),
      push: mockPush,
    }))

    render(
      <ClaimForm>
        <div>Any page</div>
      </ClaimForm>
    )

    await screen.findByText('Any page')
    const saveAndExitLink = screen.getByText('pagination.save_and_exit')

    expect(mockGetPathName).toHaveBeenCalledTimes(1)
    expect(saveAndExitLink).toBeInTheDocument()

    await user.click(saveAndExitLink)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(Routes.HOME)
  })
})
