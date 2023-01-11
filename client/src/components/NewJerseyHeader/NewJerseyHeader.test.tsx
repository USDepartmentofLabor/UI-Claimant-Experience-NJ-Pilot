import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTranslation } from 'react-i18next'
import { NewJerseyHeader } from 'components/NewJerseyHeader/NewJerseyHeader'
import { Routes, CLAIM_FORM_BASE_ROUTE } from 'constants/routes'

jest.mock('next-auth/react')
import { useSession, signOut } from 'next-auth/react'

const mockUseSession = useSession as jest.Mock
;(signOut as jest.Mock).mockImplementation(() => jest.fn())

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

describe('NewJerseyHeader Component', () => {
  it('renders', () => {
    render(<NewJerseyHeader />)
    const { t } = useTranslation('common', { keyPrefix: 'header' })
    const header = screen.getByTestId('header')
    const title = within(header).getByText(t('title'))
    const menu = within(header).getByRole('navigation')
    expect(header).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(menu).toBeInTheDocument()
  })

  it('opens and closes the menu', async () => {
    const user = userEvent.setup()
    render(<NewJerseyHeader />)
    const menuButton = screen.getByRole('button', { name: 'menu' })
    await user.click(menuButton)
    expect(screen.getByRole('navigation')).toHaveAttribute(
      'class',
      expect.stringContaining('is-visible')
    )

    await user.click(screen.getByRole('img', { name: 'close' }))
    expect(screen.getByRole('navigation')).not.toHaveAttribute(
      'class',
      expect.stringContaining('is-visible')
    )
  })
  it('shows a different menu when the claim is submitted', async () => {
    mockRouter.mockImplementation(() => ({
      query: { completed: true },
      asPath: '/something',
    }))
    render(<NewJerseyHeader />)
    const myClaimMenuItem = screen.getByRole('button', { name: 'my_claim' })
    expect(myClaimMenuItem).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(myClaimMenuItem)
    expect(myClaimMenuItem).toHaveAttribute('aria-expanded', 'true')
    const appealItem = screen.getByText('appeal')
    expect(appealItem).toBeInTheDocument()
  })
  it('shows current styling when on a claim form page', () => {
    mockRouter.mockImplementation(() => ({
      asPath: `/${CLAIM_FORM_BASE_ROUTE}/something`,
    }))
    render(<NewJerseyHeader />)

    const myClaimMenuItem = screen.getByRole('link', { name: 'my_claim' })
    expect(myClaimMenuItem).toHaveClass('usa-current')
  })
  it('shows current styling when on home page', () => {
    mockRouter.mockImplementation(() => ({
      asPath: Routes.HOME,
    }))
    render(<NewJerseyHeader />)

    const myClaimMenuItem = screen.getByRole('link', { name: 'home' })
    expect(myClaimMenuItem).toHaveClass('usa-current')
  })
  it('shows current styling when on privacy page', () => {
    mockRouter.mockImplementation(() => ({
      asPath: Routes.PRIVACY,
    }))
    render(<NewJerseyHeader />)

    const myClaimMenuItem = screen.getByRole('link', { name: 'privacy' })
    expect(myClaimMenuItem).toHaveClass('usa-current')
  })
  it('lets user log out of the application', async () => {
    const user = userEvent.setup()
    mockUseSession.mockReturnValue({
      status: 'unauthenticated',
      data: null,
    })

    mockRouter.mockImplementation(() => ({
      asPath: Routes.HOME,
    }))
    render(<NewJerseyHeader />)

    const logoutNavItem = screen.getByRole('link', { name: 'logout' })
    expect(logoutNavItem).toHaveClass('usa-link usa-nav__link')

    await user.click(logoutNavItem as HTMLElement)

    expect(signOut).toHaveBeenCalledTimes(1)
  })
})
