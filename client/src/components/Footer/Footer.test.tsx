import { render, screen, within } from '@testing-library/react'
import { Footer } from 'components/Footer/Footer'
import { useTranslation } from 'react-i18next'

describe('Footer Component', () => {
  render(<Footer />)
  const { t } = useTranslation('common', { keyPrefix: 'footer' })
  const footer = screen.getByRole('contentinfo')
  const top = within(footer).getByRole('link', { name: t('return_top') })
  const logo = within(footer).getByAltText(t('logo_alt'))
  const legal = within(footer).getByRole('link', { name: t('legal') })

  it('Renders', () => {
    expect(footer).toBeInTheDocument()
    expect(top).toHaveAttribute('href', '#')
    expect(logo).toBeInTheDocument()
    expect(legal).toBeInTheDocument()
  })
})
