import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { Button } from '@trussworks/react-uswds'
import { useRouter } from 'next/router'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { Alert } from '@trussworks/react-uswds'

const Home: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('home')
  const goToFirstPageOfClaimForm = () => router.push(pageDefinitions[0].path)

  return (
    <div>
      <Head>
        <title>{t('page_title')}</title>
      </Head>
      <h1>{t('heading')}</h1>
      {router?.query?.completed && (
        <Alert
          type="success"
          heading="Claim Completed"
          headingLevel="h4"
          className="margin-bottom-3"
        />
      )}

      <Button type="button" onClick={goToFirstPageOfClaimForm}>
        Press Me
      </Button>
    </div>
  )
}

export default Home
