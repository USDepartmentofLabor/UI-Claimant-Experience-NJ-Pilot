import type { NextPage } from 'next'
import Head from 'next/head'
import { Trans, useTranslation } from 'react-i18next'
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
import { Routes } from 'constants/routes'

const BetaSuccess: NextPage = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'success' })
  const { data: whoAmI } = useWhoAmI()
  const email = whoAmI?.email

  return (
    <>
      <Head>
        <title>{t('heading')}</title>
      </Head>
      <main id="main-content" className="margin-y-5">
        <h1 className="nj-h2">{t('heading')}</h1>
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
              <p>
                <Trans
                  t={t}
                  i18nKey="id_verification_instructions"
                  components={{
                    IdMeProcessLink: (
                      // eslint-disable-next-line jsx-a11y/anchor-has-content
                      <a
                        href={Routes.ID_ME_PROCESS}
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                    ),
                  }}
                />
              </p>
              <p>{t('id_verification_requirements_lead')}</p>

              <ul className="usa-list">
                <li>
                  <Trans
                    t={t}
                    i18nKey="id_verification_requirement_gov_id"
                    components={{
                      IdMeDocTypesLink: (
                        // eslint-disable-next-line jsx-a11y/anchor-has-content
                        <a
                          href={Routes.ID_ME_DOCUMENT_TYPES}
                          target="_blank"
                          rel="noreferrer noopener"
                        />
                      ),
                    }}
                  />
                </li>
                <li>{t('id_verification_requirement_id_copy')}</li>
                <li>{t('id_verification_requirement_ssn')}</li>
                <li>{t('id_verification_requirement_sms')}</li>
                <li>{t('id_verification_requirement_email')}</li>
              </ul>
              <p>
                <strong>{t('id_verification_closing', { email })}</strong>
              </p>
              <a
                href={Routes.ID_ME_VERIFY}
                className="usa-button"
                target="_blank"
                rel="noreferrer noopener"
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
