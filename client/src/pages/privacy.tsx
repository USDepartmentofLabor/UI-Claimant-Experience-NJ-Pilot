import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'

const Privacy: NextPage = () => {
  const { t } = useTranslation('privacy')

  return (
    <>
      <Head>
        <meta name="claim form" content="Fill out the form provided" />
        <title>{t('page_title')}</title>
      </Head>
      <h1>{t('heading')}</h1>
      <p>{t('p1')}</p>
      <p>{t('p2')}</p>
    </>
  )
}

export default Privacy
