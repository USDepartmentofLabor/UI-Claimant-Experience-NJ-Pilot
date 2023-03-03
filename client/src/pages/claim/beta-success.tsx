import type { NextPage } from 'next'
import Head from 'next/head'
import { Trans, useTranslation } from 'react-i18next'
import { SignOut } from 'components/SignOut/SignOut'
import { EXTERNAL_CONTACT_EMAIL } from 'constants/routes'
import { ExternalWebsiteButton } from 'components/form/ClaimFormButtons/ExternalWebsiteButton/ExternalWebsiteButton'
const BetaSuccess: NextPage = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'success' })

  return (
    <>
      <Head>
        <title>{t('heading')}</title>
      </Head>
      <main
        className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
        id="main-content"
      >
        <h1>{t('heading')}</h1>
        <p>{t('success_details')}</p>
        <p>
          <Trans t={t} i18nKey="contact_details">
            <a href={`mailto:${EXTERNAL_CONTACT_EMAIL}`}>{''}</a>
          </Trans>
        </p>
        <div className="margin-bottom-1">
          <SignOut isNavLink={false} />
        </div>
        <div className="margin-bottom-1">
          <ExternalWebsiteButton option={'payment'} />
        </div>
        <div className="margin-bottom-1">
          <ExternalWebsiteButton option={'contact'} />
        </div>
        <div className="margin-bottom-1">
          <ExternalWebsiteButton option={'tax'} />
        </div>
      </main>
    </>
  )
}

export default BetaSuccess
