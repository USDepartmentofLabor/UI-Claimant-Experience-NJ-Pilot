import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { Button } from '@trussworks/react-uswds'

const Home: NextPage = () => {
  const { t } = useTranslation('home')
  return (
    <div>
      <Head>
        <title>{t('page_title')}</title>
      </Head>
      <h1>{t('heading')}</h1>
      <Button type="button"> Press Me</Button>
    </div>
  )
}

export default Home
