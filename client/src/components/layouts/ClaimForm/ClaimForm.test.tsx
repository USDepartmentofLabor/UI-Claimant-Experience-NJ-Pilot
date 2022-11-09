import { render, screen, within } from '@testing-library/react'
import { ClaimForm } from 'components/layouts/ClaimForm/ClaimForm'
import { makeClaimFormRoute, Routes } from 'constants/routes'
import userEvent from '@testing-library/user-event'
import { useWhoAmI } from 'hooks/useWhoAmI'
import { SIGN_OUT_REDIRECT } from 'utils/signout/cognitoSignOut'
import { signOut } from 'next-auth/react'

jest.mock('next-auth/react')
const mockSignOut = signOut as jest.Mock

const useRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => useRouter(),
}))
jest.mock('constants/pages/pageDefinitions')

const useSavePartialClaim = jest.fn()
const useSaveCompleteClaim = jest.fn()
const useSubmitClaim = jest.fn()
jest.mock('queries/useSavePartialClaim', () => ({
  useSavePartialClaim: () => useSavePartialClaim(),
}))
jest.mock('queries/useSaveCompleteClaim', () => ({
  useSaveCompleteClaim: () => useSaveCompleteClaim(),
}))
jest.mock('queries/useSubmitClaim', () => ({
  useSubmitClaim: () => useSubmitClaim(),
}))

const savePartialMutateAsync = jest.fn()
const mutateAsync = jest.fn()
const reset = jest.fn()

useSaveCompleteClaim.mockImplementation(() => ({
  mutateAsync: mutateAsync,
  reset: reset,
}))

useSubmitClaim.mockImplementation(() => ({
  mutateAsync: mutateAsync,
  reset: reset,
}))
useSavePartialClaim.mockImplementation(() => ({
  mutateAsync: savePartialMutateAsync,
}))

const useGetPartialClaim = jest.fn()
jest.mock('queries/useGetPartialClaim', () => ({
  useGetPartialClaim: () => useGetPartialClaim(),
}))
useGetPartialClaim.mockImplementation(() => ({
  data: {},
  isLoading: false,
}))

beforeEach(() => {
  savePartialMutateAsync.mockClear()
})
jest.mock('hooks/useWhoAmI')
const mockedUseWhoAmI = useWhoAmI as jest.Mock

describe('ClaimForm Layout', () => {
  const FirstPage = () => <div>First Page!</div>
  const MiddlePage = () => <div>Middle Page!</div>
  const LastPage = () => <div>Last Page!</div>

  const currentIndicatorStyle = 'usa-step-indicator__segment--current'
  const completeIndicatorStyle = 'usa-step-indicator__segment--complete'

  describe('first page', () => {
    mockedUseWhoAmI.mockImplementation(() => ({
      data: {
        firstName: 'Dori',
        lastName: 'Coxen',
        middleInitial: 'D',
        birthdate: '1999-08-20',
        email: 'dori@test.com',
        phone: '555-555-4321',
      },
      isLoading: false,
    }))
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
      const claimFormPageHeading = screen.queryByText('First page', {
        selector: 'h1',
      })

      expect(previousPageButton).not.toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
      expect(saveAndExitLink).toBeInTheDocument()
      expect(claimFormPageHeading).toBeInTheDocument()

      expect(savePartialMutateAsync).not.toHaveBeenCalled()
      const steps = within(screen.getByTestId('step-indicator')).getAllByRole(
        'listitem'
      )
      steps.forEach((step) => {
        if (step.textContent?.includes('First page'))
          expect(step.classList.contains(currentIndicatorStyle)).toBe(true)
        else
          expect(
            step.classList.contains(currentIndicatorStyle) ||
              step.classList.contains(completeIndicatorStyle)
          ).toBe(false)
      })

      const sideNavElements = within(screen.getByTestId('sidenav'))

      expect(
        sideNavElements
          .getByText('First page')
          .classList.contains('usa-current')
      ).toBe(true)
      expect(
        sideNavElements
          .getByText('Middle page')
          .classList.contains('usa-current')
      ).toBe(false)
      expect(
        sideNavElements.getByText('Last page').classList.contains('usa-current')
      ).toBe(false)
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

      expect(nextButton).toBeInTheDocument()

      await user.click(nextButton)

      const claimFormPageHeading = screen.getByTestId('claim-form-page-heading')

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(middlePageRoute)
      expect(claimFormPageHeading).toHaveFocus()
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
      const claimFormPageHeading = screen.queryByText('Middle page', {
        selector: 'h1',
      })

      expect(previousButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
      expect(saveAndExitLink).toBeInTheDocument()
      expect(claimFormPageHeading).toBeInTheDocument()

      const steps = within(screen.getByTestId('step-indicator')).getAllByRole(
        'listitem'
      )
      steps.forEach((step) => {
        if (step.textContent?.includes('Middle page'))
          expect(step.classList.contains(currentIndicatorStyle)).toBe(true)
        else if (step.textContent?.includes('First page'))
          expect(step.classList.contains(completeIndicatorStyle)).toBe(true)
        else
          expect(
            step.classList.contains(currentIndicatorStyle) ||
              step.classList.contains(completeIndicatorStyle)
          ).toBe(false)
      })
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

      expect(previousButton).toBeInTheDocument()

      await user.click(previousButton)

      const claimFormPageHeading = screen.getByTestId('claim-form-page-heading')

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(firstPageRoute)
      expect(savePartialMutateAsync).toHaveBeenCalledTimes(1)
      expect(claimFormPageHeading).toHaveFocus()
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
      const completeButton = screen.queryByText('pagination.submit')
      const saveAndExitLink = screen.queryByText('pagination.save_and_exit')
      const claimFormPageHeading = screen.queryByText('Last page', {
        selector: 'h1',
      })

      expect(previousButton).toBeInTheDocument()
      expect(nextButton).not.toBeInTheDocument()
      expect(completeButton).toBeInTheDocument()
      expect(saveAndExitLink).toBeInTheDocument()
      expect(claimFormPageHeading).toBeInTheDocument()

      const steps = within(screen.getByTestId('step-indicator')).getAllByRole(
        'listitem'
      )
      steps.forEach((step) => {
        if (step.textContent?.includes('Last page'))
          expect(step.classList.contains(currentIndicatorStyle)).toBe(true)
        else expect(step.classList.contains(completeIndicatorStyle)).toBe(true)
      })
    })

    it('clicking submit navigates home', async () => {
      const user = userEvent.setup()
      const mockGetPathName = jest.fn(() => makeClaimFormRoute('last'))
      const mockPush = jest.fn(async () => true)

      mutateAsync.mockImplementation(() => ({
        status: 200,
      }))

      mutateAsync.mockImplementation(() => ({
        status: 200,
      }))
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
      const completeButton = screen.getByText('pagination.submit')

      expect(completeButton).toBeInTheDocument()

      await user.click(completeButton)

      expect(savePartialMutateAsync).toHaveBeenCalledTimes(1)
      expect(mutateAsync).toHaveBeenCalledTimes(2)
      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith({
        pathname: Routes.HOME,
        query: { completed: true },
      })
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
    const completeButton = screen.queryByText('pagination.submit')
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

    expect(saveAndExitLink).toBeInTheDocument()

    await user.click(saveAndExitLink)

    expect(savePartialMutateAsync).toHaveBeenCalledTimes(1)
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: SIGN_OUT_REDIRECT })
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })
  describe('when ClaimForm is loading', () => {
    it('shows PageLoader while loading', () => {
      mockedUseWhoAmI.mockImplementation(() => ({
        data: {},
        isLoading: true,
      }))
      render(
        <ClaimForm>
          <div>Any page</div>
        </ClaimForm>
      )
      expect(screen.getByTestId('page-loading')).toBeInTheDocument()
    })
  })
})
