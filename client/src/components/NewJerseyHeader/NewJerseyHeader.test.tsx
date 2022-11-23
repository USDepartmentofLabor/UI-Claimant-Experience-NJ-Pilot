import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTranslation } from 'react-i18next'
import { NewJerseyHeader } from 'components/NewJerseyHeader/NewJerseyHeader'

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
  it('shows a different menu when the claim is submitted', () => {
    mockRouter.mockImplementation(() => ({
      query: { completed: true },
      asPath: '/something',
    }))
    render(<NewJerseyHeader />)
    const appealItem = screen.getByText('appeal')
    expect(appealItem).toBeInTheDocument()
  })
})
