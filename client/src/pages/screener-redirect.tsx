import type { NextPage } from 'next'
import Head from 'next/head'
import { Trans, useTranslation } from 'react-i18next'
import {
  Button,
  SummaryBoxHeading,
  SummaryBox,
  SummaryBoxContent,
  Link,
} from '@trussworks/react-uswds'
import styles from 'styles/pages/redirect.module.scss'
import {
  OUTSIDE_US_AGENT_NUMBER,
  DISABILITY_BENEFITS_AGENT_NUMBER,
  CLAIMS_AGENT_NUMBER_1,
  CLAIMS_AGENT_NUMBER_2,
  CLAIMS_AGENT_NUMBER_3,
} from 'constants/phoneNumbers'
import { pageDefinitions } from 'constants/pages/pageDefinitions'

const ScreenerRedirect: NextPage = () => {
  const { t } = useTranslation('redirect')

  return (
    <>
      <Head>
        <title>{t('page_title')}</title>
      </Head>

      <h1>{t('page_title')}</h1>

      <SummaryBox>
        <SummaryBoxHeading headingLevel="h2">
          {t('info_alert.title')}
        </SummaryBoxHeading>
        <SummaryBoxContent>
          <ul>
            <li>
              {t('info_alert.items.ip_deny')}
              <Link variant="nav" href={'#ip_deny'}>
                {t('read_more')}
              </Link>
            </li>
            <li>
              {t('info_alert.items.canada')}
              <Link variant="nav" href={'#canada'}>
                {t('read_more')}
              </Link>
            </li>
            <li>
              {t('info_alert.items.non_resident')}
              <Link variant="nav" href={'#non_resident'}>
                {t('read_more')}
              </Link>
            </li>
            <li>
              {t('info_alert.items.other_state')}
              <Link variant="nav" href={'#other_state'}>
                {t('read_more')}
              </Link>
            </li>
            <li>
              {t('info_alert.items.disability')}
              <Link variant="nav" href={'#disability'}>
                {t('read_more')}
              </Link>
            </li>
            <li>
              {t('info_alert.items.military_mvp')}
              <Link variant="nav" href={'#military_mvp'}>
                Read more
              </Link>
            </li>
            <li>
              {t('info_alert.items.military_ip')}
              <Link variant="nav" href={'#military_ip'}>
                {t('read_more')}
              </Link>
            </li>
            <li>
              {t('info_alert.items.maritime')}
              <Link variant="nav" href={'#maritime'}>
                {t('read_more')}
              </Link>
            </li>
          </ul>
        </SummaryBoxContent>
      </SummaryBox>

      <div className={styles.bottom_horizontal_line}>
        <h2 id="ip_deny">{t('ip_deny.heading')}</h2>
        <p>{t('ip_deny.label')}</p>
      </div>

      <div className={styles.bottom_horizontal_line}>
        <h2 id="canada">{t('canada.heading')}</h2>
        <Trans t={t} i18nKey="canada.label.line1">
          <a href={`tel:${OUTSIDE_US_AGENT_NUMBER}`}>
            {OUTSIDE_US_AGENT_NUMBER}
          </a>
        </Trans>
        <p>{t('canada.label.line2')}</p>
      </div>

      <div className={styles.bottom_horizontal_line}>
        <h2 id="non_resident">{t('non_resident.heading')}</h2>
        <p>{t('non_resident.label')}</p>
      </div>

      <div className={styles.bottom_horizontal_line}>
        <h2 id="other_state">{t('other_state.heading')}</h2>
        <p>{t('other_state.label')}</p>
        <p>
          <Button
            type="button"
            onClick={() =>
              (window.location.href =
                'https://www.dol.gov/general/topic/unemployment-insurance/')
            }
          >
            {t('other_state.button')}
          </Button>
        </p>
      </div>

      <div className={styles.bottom_horizontal_line}>
        <h2 id="disability">{t('disability.heading')}</h2>
        <p>{t('disability.label.line1')}</p>
        <p>
          <Trans t={t} i18nKey="disability.label.line2">
            <a href={`tel:${DISABILITY_BENEFITS_AGENT_NUMBER}`}>
              {DISABILITY_BENEFITS_AGENT_NUMBER}
            </a>
          </Trans>
        </p>
        <p>
          <Button
            type="button"
            onClick={() =>
              (window.location.href =
                'https://nj.gov/labor/myleavebenefits/worker/tdi/')
            }
          >
            {t('disability.button')}
          </Button>
        </p>
      </div>

      <div className={styles.bottom_horizontal_line}>
        <h2 id="military_mvp">{t('military_mvp.heading')}</h2>
        <p>{t('military_mvp.label.line1')}</p>
        <p>
          <Button
            type="button"
            onClick={
              () =>
                (window.location.href =
                  'https://secure.dol.state.nj.us/sso/XUI/#login/&realm=ui&goto=https%3A%2F%2Fclaimproxy.dol.state.nj.us%3A443%2Fnjsuccess') //TODO change this link
            }
          >
            {t('military_mvp.label.button')}
          </Button>
        </p>
      </div>

      <div className={styles.bottom_horizontal_line}>
        <h2 id="military_ip">{t('military_ip.heading')}</h2>
        <p>{t('military_ip.label.line1')}</p>
        <Trans t={t} i18nKey="military_ip.label.line2">
          <a href={pageDefinitions[0].path}>
            Continue without claiming military wages, only non-military NJ wages
          </a>
        </Trans>
        <p>
          <Trans t={t} i18nKey="military_ip.label.line3">
            <a href={`tel:${CLAIMS_AGENT_NUMBER_1}`}>{CLAIMS_AGENT_NUMBER_1}</a>
            <a href={`tel:${CLAIMS_AGENT_NUMBER_2}`}>{CLAIMS_AGENT_NUMBER_2}</a>
            <a href={`tel:${CLAIMS_AGENT_NUMBER_3}`}>{CLAIMS_AGENT_NUMBER_3}</a>
          </Trans>
        </p>
        <p>{t('agent_contact.label.line1')}</p>
      </div>

      <div>
        <h2 id="maritime">{t('maritime.heading')}</h2>
        <p>{t('maritime.label.line1')}</p>
        <div>
          <Trans t={t} i18nKey="maritime.label.line2">
            <a href={`tel:${CLAIMS_AGENT_NUMBER_1}`}>{CLAIMS_AGENT_NUMBER_1}</a>
            <a href={`tel:${CLAIMS_AGENT_NUMBER_2}`}>{CLAIMS_AGENT_NUMBER_2}</a>
            <a href={`tel:${CLAIMS_AGENT_NUMBER_3}`}>{CLAIMS_AGENT_NUMBER_3}</a>
            <a href={`tel:${OUTSIDE_US_AGENT_NUMBER}`}>
              {OUTSIDE_US_AGENT_NUMBER}
            </a>
          </Trans>
        </div>
        <p>{t('agent_contact.label.line1')}</p>
      </div>
    </>
  )
}

export default ScreenerRedirect
