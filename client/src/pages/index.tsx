import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { Button } from '@trussworks/react-uswds'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import PageLoader from 'components/loaders/PageLoader'
import { Alert } from '@trussworks/react-uswds'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { useGetPartialClaim } from 'queries/useGetPartialClaim'
import Error from 'next/error'
import { DevHome } from 'components/DevHome/DevHome'
import { NoCurrentClaimHome } from 'components/NoCurrentClaimHome/NoCurrentClaimHome'

const Home: NextPage = () => {
  const session = useSession()
  const router = useRouter()
  const { t } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')

  const {
    data: partialClaim,
    isLoading: isLoadingGetPartialClaim,
    isError: partialClaimIsError,
  } = useGetPartialClaim()

  const { setClaimFormValues } = useContext(ClaimFormContext)
  //const { ssnInput, screenerInput } = useContext(IntakeAppContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [claimStatus, setClaimStatus] = useState<string>('')
  //const [showPromptClaimStatus, setShowPromptClaimStatus] = useState<boolean>(true) // TODO resume here
  const hasInProgressClaim =
    partialClaim !== undefined && Object.keys(partialClaim).length > 0
  useEffect(() => {
    if (!isLoadingGetPartialClaim) {
      if (partialClaim !== undefined) {
        setClaimFormValues(partialClaim)
      }
      setIsLoading(false)
    }
  }, [partialClaim, isLoadingGetPartialClaim])

  const renderHomepageContents = (claimStatus: string) => {
    switch (claimStatus) {
      case 'noCurrentClaim':
        return <NoCurrentClaimHome />
      default:
        return (
          <DevHome
            session={session}
            partialClaim={partialClaim}
            hasInProgressClaim={hasInProgressClaim}
            setClaimStatus={setClaimStatus}
          />
        )
    }
  }

  const renderedHomePage = (
    <div>
      <Head>
        <title>{t('page_title')}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <main
        className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-8"
        id="main-content"
      >
        <h1 data-testid="home-page-heading">
          {claimStatus === 'noCurrentClaim'
            ? t('heading_no_claim')
            : t('heading')}
        </h1>
        {router?.query?.completed && (
          <Alert type="success" headingLevel="h4" className="margin-bottom-3">
            {t('complete_claim_success')}
          </Alert>
        )}
        {session.status === 'loading' ? (
          <PageLoader />
        ) : session.data?.user && session.data?.whoAmI ? (
          renderHomepageContents(claimStatus)
        ) : (
          <Button id="signIn" type="button" onClick={() => signIn('cognito')}>
            {tCommon('header.signin')}
          </Button>
        )}
      </main>
    </div>
  )

  if (isLoading) {
    return <PageLoader />
  } else if (partialClaimIsError) {
    return <Error title={tCommon('errorStatus.500')} statusCode={500} />
  } else {
    return renderedHomePage
  }
}

export default Home
