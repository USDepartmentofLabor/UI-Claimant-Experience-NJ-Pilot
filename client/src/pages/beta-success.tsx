import type { NextPage } from 'next'
import Head from 'next/head'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from '@trussworks/react-uswds'

import { SignOut } from 'components/SignOut/SignOut'

import { UpdateContactButton } from 'components/form/ClaimFormButtons/UpdateContactButton/UpdateContactButton'
import { TaxDocumentsButton } from 'components/form/ClaimFormButtons/TaxDocumentsButton/TaxDocumentsButton'
import { PaymentButton } from 'components/form/ClaimFormButtons/PaymentButton/PaymentButton'

const BetaSuccess: NextPage = () => {
  const { t } = useTranslation('common', { keyPrefix: 'success' })
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
        <Trans t={t} i18nKey="contact_details">
          <Link href="contact_email">{''}</Link>
        </Trans>
        <div className="margin-bottom-1">
          <SignOut isNavLink={false} />
        </div>
        <div className="margin-bottom-1">
          <PaymentButton />
        </div>
        <div className="margin-bottom-1">
          {' '}
          <UpdateContactButton />{' '}
        </div>
        <div className="margin-bottom-1">
          {' '}
          <TaxDocumentsButton />
        </div>
      </main>
    </>
  )
}

export default BetaSuccess
