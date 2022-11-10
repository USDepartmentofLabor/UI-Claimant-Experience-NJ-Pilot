import { ReactNode } from 'react'
import { useTranslation } from 'next-i18next'

import { TestSiteBanner } from 'components/TestSiteBanner/TestSiteBanner'
import { NewJerseyBanner } from 'components/NewJerseyBanner/NewJerseyBanner'
import { Footer } from 'components/Footer/Footer'

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('common')
  const showTestBanner = process.env.NEXT_PUBLIC_APP_ENV !== 'production'
  return (
    <>
      <a className="usa-skipnav" href="#main-content">
        {t('skip_nav')}
      </a>

      <div>
        {showTestBanner && <TestSiteBanner />}
        <NewJerseyBanner />
        {children}
        <Footer />
      </div>
    </>
  )
}
