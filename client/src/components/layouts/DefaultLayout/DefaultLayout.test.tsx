import { render, screen } from '@testing-library/react'
import 'next-i18next'

import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout'

describe('ClaimApp', () => {
  const originalEnv = process.env
  it('renders the expected content', () => {
    render(
      <DefaultLayout>
        <div>I am inside the layout</div>
      </DefaultLayout>
    )

    expect(screen.getByText('skip_nav')).toBeInTheDocument()
    expect(screen.getByText('test_banner')).toBeInTheDocument()
    expect(screen.getByTestId('banner-content')).toBeInTheDocument()
  })
  it('renders the TestSiteBanner when not in production environment', () => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_ENV: 'test',
    }
    render(
      <DefaultLayout>
        <div>I am inside the layout</div>
      </DefaultLayout>
    )
    expect(screen.getByText('test_banner')).toBeInTheDocument()
  })

  it('does not render the TestSiteBanner when in a production environment', () => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_ENV: 'production',
    }
    render(
      <DefaultLayout>
        <div>I am inside the layout</div>
      </DefaultLayout>
    )
    expect(screen.queryByText('test_banner')).not.toBeInTheDocument()
  })
})
