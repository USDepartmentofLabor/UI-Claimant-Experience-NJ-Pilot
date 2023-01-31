import { render, screen } from '@testing-library/react'
import { AppContextProviders } from './AppContextProviders'

test('AppContextProviders renders as expected', () => {
  const child = 'Vader, I am your child'
  render(
    <AppContextProviders>
      <div>{child}</div>
    </AppContextProviders>
  )

  expect(screen.getByText(child)).toBeInTheDocument()
})
