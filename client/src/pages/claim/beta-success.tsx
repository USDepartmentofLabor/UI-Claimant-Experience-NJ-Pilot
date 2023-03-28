import type { NextPage } from 'next'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Icon,
  IconList,
  IconListContent,
  IconListIcon,
  IconListItem,
  IconListTitle,
} from '@trussworks/react-uswds'
import { useWhoAmI } from 'hooks/useWhoAmI'

const BetaSuccess: NextPage = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'success' })
  const { data: whoAmI } = useWhoAmI()
  const email = whoAmI?.email

  return (
    <>
      <Head>
        <title>{t('heading')}</title>
      </Head>
      <main id="main-content" className="margin-bottom-6">
        <h1>{t('heading')}</h1>
        <Alert type="success" headingLevel="h2" heading={t('alert_heading')}>
          {t('success_details')}
        </Alert>
        <IconList className="nj-icon-list margin-top-5">
          <IconListItem>
            <IconListIcon>
              <Icon.VerifiedUser />
            </IconListIcon>
            <IconListContent>
              <IconListTitle type="h2">
                {t('id_verification_heading')}
              </IconListTitle>
              <p>{t('id_verification_instructions')}</p>
              <p>{t('id_verification_requirements_lead')}</p>
              <ul className="usa-list">
                {t('id_verification_requirements_list', {
                  returnObjects: true,
                }).map((content) => (
                  <li key={content}>{content}</li>
                ))}
              </ul>
              <p>
                <strong>{t('id_verification_closing', { email })}</strong>
              </p>
              <a
                href="https://hosted-pages.id.me/njdolverify"
                className="usa-button"
                data-testid="id.me link"
              >
                {t('id_verification_button')}
              </a>
            </IconListContent>
          </IconListItem>
        </IconList>
      </main>
    </>
  )
}

export default BetaSuccess
