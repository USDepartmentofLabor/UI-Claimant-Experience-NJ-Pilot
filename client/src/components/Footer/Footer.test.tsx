import { render, screen, within } from '@testing-library/react'
import { Footer } from 'components/Footer/Footer'
import { useTranslation } from 'react-i18next'

describe('Footer Component', () => {
  render(<Footer />)
  const { t } = useTranslation('common', { keyPrefix: 'footer' })
  const footer = screen.getByRole('footer')
  const top = within(footer).getByLabelText(t('return_top'))
  const logo = within(footer).getByAltText(t('logo_alt'))
  const legal = within(footer).getByLabelText(t('legal'))

  it('Renders', () => {
    expect(footer).toBeInTheDocument()
    expect(top).toBeInTheDocument()
    expect(logo).toBeInTheDocument()
    expect(legal).toBeInTheDocument()
  })
})
