import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  Button,
  SummaryBoxHeading,
  SummaryBox,
  SummaryBoxContent,
  Link,
} from '@trussworks/react-uswds'
import {
  OUTSIDE_US_AGENT_NUMBER,
  DISABILITY_BENEFITS_AGENT_NUMBER,
  CLAIMS_AGENT_NUMBER_1,
  CLAIMS_AGENT_NUMBER_2,
  CLAIMS_AGENT_NUMBER_3,
} from 'constants/phoneNumbers'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { IntakeAppContext } from 'contexts/IntakeAppContext'

const ScreenerRedirect: NextPage = () => {
  const { t } = useTranslation('redirect')
  const { screenerInput } = useContext(IntakeAppContext)

  const {
    screener_current_country_us,
    screener_live_in_canada,
    screener_any_work_nj,
    screener_military_service_eighteen_months,
    screener_currently_disabled,
    screener_federal_work_in_last_eighteen_months,
    screener_maritime_employer_eighteen_months,
  } = screenerInput || {}

  const ipInUS = true // temporary until we pull IP addresses
  const ipInNJ = true // temporary until we pull IP addresses

  const borderStyle = 'border-bottom-1px border-base-lighter padding-bottom-4'
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
            {!ipInUS && (
              <li>
                {t('info_alert.items.ip_deny')}
                <Link variant="nav" href={'#ip_deny'}>
                  {t('read_more')}
                </Link>
              </li>
            )}
            {screener_live_in_canada && (
              <li>
                {t('info_alert.items.canada')}
                <Link variant="nav" href={'#canada'}>
                  {t('read_more')}
                </Link>
              </li>
            )}
            {screener_current_country_us === false &&
              screener_live_in_canada === false && (
                <li>
                  {t('info_alert.items.non_resident')}
                  <Link variant="nav" href={'#non_resident'}>
                    {t('read_more')}
                  </Link>
                </li>
              )}
            {screener_any_work_nj === false && (
              <li>
                {t('info_alert.items.other_state')}
                <Link variant="nav" href={'#other_state'}>
                  {t('read_more')}
                </Link>
              </li>
            )}
            {screener_military_service_eighteen_months && (
              <li>
                {t('info_alert.items.military_mvp')}
                <Link variant="nav" href={'#military_mvp'}>
                  {t('read_more')}
                </Link>
              </li>
            )}
            {!ipInNJ && (
              <li>
                {t('info_alert.items.military_ip')}
                <Link variant="nav" href={'#military_ip'}>
                  {t('read_more')}
                </Link>
              </li>
            )}
            {screener_currently_disabled && (
              <li>
                {t('info_alert.items.disability')}
                <Link variant="nav" href={'#disability'}>
                  {t('read_more')}
                </Link>
              </li>
            )}
            {screener_federal_work_in_last_eighteen_months && (
              <li>
                {t('info_alert.items.federal')}
                <Link variant="nav" href={'#federal'}>
                  {t('read_more')}
                </Link>
              </li>
            )}
            {screener_maritime_employer_eighteen_months && (
              <li>
                {t('info_alert.items.maritime')}
                <Link variant="nav" href={'#maritime'}>
                  {t('read_more')}
                </Link>
              </li>
            )}
          </ul>
        </SummaryBoxContent>
      </SummaryBox>

      {!ipInUS && (
        <div className={borderStyle}>
          <h2 id="ip_deny">{t('ip_deny.heading')}</h2>
          <p>{t('ip_deny.label')}</p>
        </div>
      )}

      {screener_live_in_canada && (
        <div className={borderStyle}>
          <h2 id="canada">{t('canada.heading')}</h2>
          <Trans t={t} i18nKey="canada.label.line1">
            <a href={`tel:${OUTSIDE_US_AGENT_NUMBER}`}>
              {OUTSIDE_US_AGENT_NUMBER}
            </a>
          </Trans>
          <p>{t('canada.label.line2')}</p>
        </div>
      )}

      {screener_current_country_us === false &&
        screener_live_in_canada === false && (
          <div className={borderStyle}>
            <h2 id="non_resident">{t('non_resident.heading')}</h2>
            <p>{t('non_resident.label')}</p>
          </div>
        )}

      {screener_any_work_nj === false && (
        <div className={borderStyle}>
          <h2 id="other_state">{t('other_state.heading')}</h2>
          <p>{t('other_state.label')}</p>
          <p>
            <Button
              type="button"
              onClick={() =>
                window.location.assign(
                  'https://www.dol.gov/general/topic/unemployment-insurance/'
                )
              }
            >
              {t('other_state.button')}
            </Button>
          </p>
        </div>
      )}

      {screener_military_service_eighteen_months && (
        <div className={borderStyle}>
          <h2 id="military_mvp">{t('military_mvp.heading')}</h2>
          <p>{t('military_mvp.label.line1')}</p>
          <p>
            <Button
              type="button"
              onClick={
                () =>
                  window.location.assign(
                    'https://secure.dol.state.nj.us/sso/XUI/#login/&realm=ui&goto=https%3A%2F%2Fclaimproxy.dol.state.nj.us%3A443%2Fnjsuccess'
                  ) //TODO change this link
              }
            >
              {t('military_mvp.label.button')}
            </Button>
          </p>
        </div>
      )}

      {!ipInNJ && (
        <div className={borderStyle}>
          <h2 id="military_ip">{t('military_ip.heading')}</h2>
          <p>{t('military_ip.label.line1')}</p>
          <Trans t={t} i18nKey="military_ip.label.line2">
            <a href={pageDefinitions[0].path}>
              Continue without claiming military wages, only non-military NJ
              wages
            </a>
          </Trans>
          <p>
            <Trans t={t} i18nKey="military_ip.label.line3">
              <a href={`tel:${CLAIMS_AGENT_NUMBER_1}`}>
                {CLAIMS_AGENT_NUMBER_1}
              </a>
              <a href={`tel:${CLAIMS_AGENT_NUMBER_2}`}>
                {CLAIMS_AGENT_NUMBER_2}
              </a>
              <a href={`tel:${CLAIMS_AGENT_NUMBER_3}`}>
                {CLAIMS_AGENT_NUMBER_3}
              </a>
            </Trans>
          </p>
          <p>{t('agent_contact.label.line1')}</p>
        </div>
      )}

      {screener_currently_disabled && (
        <div className={borderStyle}>
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
                window.location.assign(
                  'https://nj.gov/labor/myleavebenefits/worker/tdi/'
                )
              }
            >
              {t('disability.label.button')}
            </Button>
          </p>
        </div>
      )}

      {screener_federal_work_in_last_eighteen_months && (
        <div className={borderStyle}>
          <h2 id="federal">{t('federal.heading')}</h2>
          <p>{t('federal.label.line1')}</p>
          <p>
            <Button
              type="button"
              onClick={
                () =>
                  window.location.assign(
                    'https://secure.dol.state.nj.us/sso/XUI/#login/&realm=ui&goto=https%3A%2F%2Fclaimproxy.dol.state.nj.us%3A443%2Fnjsuccess'
                  ) //TODO change this link
              }
            >
              {t('federal.label.button')}
            </Button>
          </p>
        </div>
      )}

      {screener_maritime_employer_eighteen_months && (
        <div>
          <h2 id="maritime">{t('maritime.heading')}</h2>
          <p>{t('maritime.label.line1')}</p>
          <div>
            <Trans t={t} i18nKey="maritime.label.line2">
              <a href={`tel:${CLAIMS_AGENT_NUMBER_1}`}>
                {CLAIMS_AGENT_NUMBER_1}
              </a>
              <a href={`tel:${CLAIMS_AGENT_NUMBER_2}`}>
                {CLAIMS_AGENT_NUMBER_2}
              </a>
              <a href={`tel:${CLAIMS_AGENT_NUMBER_3}`}>
                {CLAIMS_AGENT_NUMBER_3}
              </a>
              <a href={`tel:${OUTSIDE_US_AGENT_NUMBER}`}>
                {OUTSIDE_US_AGENT_NUMBER}
              </a>
            </Trans>
          </div>
          <p>{t('agent_contact.label.line1')}</p>
        </div>
      )}
    </>
  )
}

export default ScreenerRedirect
