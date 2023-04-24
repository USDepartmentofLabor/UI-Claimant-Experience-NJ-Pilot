import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'

const Privacy: NextPage = () => {
  const { t } = useTranslation('privacy')

  return (
    <>
      <Head>
        <title>{t('page_title')}</title>
      </Head>
      <main
        className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
        id="main-content"
      >
        <h1>{t('heading')}</h1>
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
      </main>
    </>
  )
}

export default Privacy
