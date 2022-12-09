import { ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeading } from 'components/form/ClaimFormHeading/PageHeading'

import Head from 'next/head'

type ScreenerFormProps = {
  children: ReactNode
}

export const ScreenerLayout = ({ children }: ScreenerFormProps) => {
  const { t } = useTranslation('screener')
  const headingRef = useRef<HTMLHeadingElement>(null)

  const heading = t('heading')

  return (
    <>
      <Head>
        <title>{heading}</title>
      </Head>
      <div className="grid-row grid-gap">
        <main
          className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
          id="main-content"
        >
          <PageHeading ref={headingRef} aria-label={`${heading}`}>
            {heading}
          </PageHeading>
          {children}
        </main>
      </div>
    </>
  )
}
