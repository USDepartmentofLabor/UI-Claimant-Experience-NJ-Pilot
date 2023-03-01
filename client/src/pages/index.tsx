import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { Button } from '@trussworks/react-uswds'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import PageLoader from 'components/loaders/PageLoader'
import { Table } from '@trussworks/react-uswds'
import { WhoAmI } from 'types/claimantInput'
import { Routes } from 'constants/routes'
import { SignOut } from 'components/SignOut/SignOut'
import serverHttpClient from 'utils/http/serverHttpClient'
import { APIResponseType } from 'types/ResponseTypes'
import { useClaimProgress } from 'hooks/useClaimProgress'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { useGetPartialClaim } from 'queries/useGetPartialClaim'
import { IntakeAppContext } from 'contexts/IntakeAppContext'
import Error from 'next/error'
import { PaymentButton } from 'components/form/ClaimFormButtons/PaymentButton/PaymentButton'
import { UpdateContactButton } from 'components/form/ClaimFormButtons/UpdateContactButton/UpdateContactButton'
import { TaxDocumentsButton } from 'components/form/ClaimFormButtons/TaxDocumentsButton/TaxDocumentsButton'

const Home: NextPage = () => {
  const session = useSession()
  const router = useRouter()
  const { t } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')
  const { continuePath } = useClaimProgress()

  const {
    data: partialClaim,
    isLoading: isLoadingGetPartialClaim,
    isError: partialClaimIsError,
  } = useGetPartialClaim()

  const goToLastUnfinishedClaimFormPage = () => {
    // TODO: handle what to do if they have a completed claim
    let path
    if (partialClaim?.ssn === undefined && ssnInput?.ssn === undefined) {
      path = Routes.SSN
    } else if (
      partialClaim?.screener_current_country_us === undefined &&
      screenerInput === undefined
    ) {
      path = Routes.SCREENER
    } else {
      path = continuePath
    }
    router.push(path)
  }

  const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'

  const { setClaimFormValues } = useContext(ClaimFormContext)
  const { ssnInput, screenerInput } = useContext(IntakeAppContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
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
        className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
        id="main-content"
      >
        <h1 data-testid="home-page-heading">{t('heading')}</h1>
        {session.status === 'loading' ? (
          <PageLoader />
        ) : session.data?.user && session.data?.whoAmI ? (
          <>
            <div className="margin-bottom-1">
              <h3>Signed in as:</h3>
              <Table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(session.data.whoAmI as WhoAmI).map(
                    ([key, value], i) => (
                      <tr key={`${i}-${key}-${value}`}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </div>
            <div className="margin-bottom-1">
              <SignOut isNavLink={false} />
            </div>
            <div className="margin-bottom-1">
              <Button
                type="button"
                onClick={goToLastUnfinishedClaimFormPage}
                data-testid="go-to-claim-form"
              >
                {hasInProgressClaim
                  ? t('continue_claim_button')
                  : t('file_a_claim_button')}
              </Button>
            </div>
            {!isProd && (
              <div className="margin-bottom-1">
                <Button
                  type="button"
                  secondary
                  onClick={() =>
                    serverHttpClient
                      .post<APIResponseType>('/partial-claim', {})
                      .then(() => {
                        location.reload()
                      })
                  }
                >
                  Reset claim (dev/test)
                </Button>
              </div>
            )}
            <div className="margin-bottom-1">
              <PaymentButton />
            </div>
            <div className="margin-bottom-1">
              <UpdateContactButton />
            </div>
            <div>
              <TaxDocumentsButton />
            </div>
          </>
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
