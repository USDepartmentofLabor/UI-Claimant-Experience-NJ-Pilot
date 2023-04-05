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
  Link,
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
      <main
        id="main-content"
        className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-8"
      >
        <h1 className="nj-h2">{t('heading')}</h1>
        <Alert
          className="measure-6"
          type="success"
          headingLevel="h2"
          heading={t('alert_heading')}
        >
          {t('success_details')}
        </Alert>
        <IconList className="nj-icon-list margin-y-5 measure-6">
          <IconListItem>
            <IconListIcon aria-hidden>
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
                      // @ts-expect-error - children is i18n value
                      <Link
                        href={Routes.ID_ME_PROCESS}
                        variant="external"
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
                        // @ts-expect-error - children is i18n value
                        <Link
                          href={Routes.ID_ME_DOCUMENT_TYPES}
                          variant="external"
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
                data-testid="id-me-link"
              >
                {t('id_verification_button')}
              </a>
            </IconListContent>
          </IconListItem>
        </IconList>

        <h2>{t('expectations_heading')}</h2>

        <IconList className="nj-icon-list margin-bottom-5 measure-6">
          <IconListItem>
            <IconListIcon aria-hidden>
              <Icon.MailOutline />
            </IconListIcon>
            <IconListContent>
              <IconListTitle type="h3">
                {t('expect_comms_heading')}
              </IconListTitle>
              <p>
                <Trans t={t} i18nKey="expect_comms" />
              </p>
            </IconListContent>
          </IconListItem>
          <IconListItem>
            <IconListIcon aria-hidden>
              <Icon.Update />
            </IconListIcon>
            <IconListContent>
              <IconListTitle type="h3">
                {t('expect_certifying_heading')}
              </IconListTitle>
              <Trans
                t={t}
                i18nKey="expect_certifying"
                components={{
                  HowToCertifyLink: (
                    // @ts-expect-error - children is i18n value
                    <Link
                      href={Routes.HOW_TO_CERTIFY}
                      variant="external"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="display-inline"
                    />
                  ),
                }}
              />
              <a
                href={Routes.CERTIFY}
                className="usa-button"
                data-testid="certify-link"
              >
                {t('expect_certifying_button')}
              </a>
            </IconListContent>
          </IconListItem>
        </IconList>
        <h2 className="nj-h5 text-normal">{t('privacy_heading')}</h2>
        <div className="font-body-3xs">
          <Trans
            t={t}
            i18nKey="privacy_statement"
            components={{
              p: <p className="maxw-tablet" />,
            }}
          />
        </div>
      </main>
    </>
  )
}

export default BetaSuccess
