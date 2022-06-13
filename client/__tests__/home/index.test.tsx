import { render, screen } from '@testing-library/react'

import Home from '../../src/pages/home'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

describe('home page', () => {
  it('renders without error', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'heading'
    )
    expect(screen.getByRole('button', { name: /Press Me/ })).toHaveClass(
      'usa-button'
    )
  })
})
