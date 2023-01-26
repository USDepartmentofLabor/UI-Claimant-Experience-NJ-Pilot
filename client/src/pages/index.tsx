import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { Button } from '@trussworks/react-uswds'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import PageLoader from 'components/loaders/PageLoader'
import { Alert, Table } from '@trussworks/react-uswds'
import { WhoAmI } from 'types/claimantInput'
import { Routes } from 'constants/routes'
import { SignOut } from 'components/SignOut/SignOut'
import serverHttpClient from 'utils/http/serverHttpClient'
import { APIResponseType } from 'types/ResponseTypes'

const Home: NextPage = () => {
  const session = useSession()
  const router = useRouter()
  const { t } = useTranslation('home')
  const goToFirstPageOfClaimForm = () => router.push(pageDefinitions[0].path)
  const goToTaxDocumentsPage = () => router.push(Routes.TAX_DOCUMENTS)
  const goToUpdatePaymentForm = () => router.push(Routes.UPDATE_PAYMENT_INFO)
  const goToUpdateContactInfoForm = () =>
    router.push(Routes.UPDATE_CONTACT_INFO)
  const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'

  return (
    <div>
      <Head>
        <title>{t('page_title')}</title>
      </Head>
      <main
        className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
        id="main-content"
      >
        <h1 data-testid="home-page-heading">{t('heading')}</h1>
        {router?.query?.completed && (
          <Alert type="success" headingLevel="h4" className="margin-bottom-3">
            {t('complete_claim_success')}
          </Alert>
        )}
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
                onClick={goToFirstPageOfClaimForm}
                data-testid="go-to-claim-form"
              >
                File a claim
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
              <Button
                type="button"
                onClick={goToUpdatePaymentForm}
                data-testid="go-to-update-payment"
              >
                Update payment info
              </Button>
            </div>
            <div className="margin-bottom-1">
              <Button
                type="button"
                onClick={goToUpdateContactInfoForm}
                data-testid="go-to-update-contact-info"
              >
                {t('update_contact_info_button')}
              </Button>
            </div>
            <div>
              <Button
                type="button"
                onClick={goToTaxDocumentsPage}
                data-testid="go-to-tax-documents"
              >
                {t('tax_doc_button')}
              </Button>
            </div>
          </>
        ) : (
          <Button id="signIn" type="button" onClick={() => signIn('cognito')}>
            Sign in with Cognito
          </Button>
        )}
      </main>
    </div>
  )
}

export default Home
