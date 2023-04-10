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
  Alert,
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

function DirectionalTemplate(props: {
  children: React.ReactNode
  title: string
  warning?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <main
        id="main-content"
        className="maxw-tablet margin-x-auto desktop:margin-x-0 margin-bottom-3 desktop:grid-col-8"
      >
        <h1>{props.title}</h1>
        {props.warning && (
          <Alert type="warning" headingLevel="h2" role="alert" slim>
            {props.warning}
          </Alert>
        )}
        {props.children}
        {props.action && <div className="margin-top-4">{props.action}</div>}
      </main>
    </>
  )
}

/**
 * Based on the claimant's screener answers, this page directs them to the
 * appropriate next step.
 *
 * - Some scenarios require a phone call.
 * - Some scenarios indicate that the claimant is likely not eligible for
 *  benefits, however we don't want to prevent someone from applying — a claims
 *  agent ultimately should be the one making that determination.
 * - Some scenarios may overlap, in which case any scenario that requires applying
 *  via phone should overrule any scenario that allows filing online. If multiple
 *  scenarios require a phone call, the scenario with the more specific phone number
 *  should be used.
 */
const ScreenerRedirect: NextPage = () => {
  const { t } = useTranslation('redirect')
  const { screenerInput } = useContext(IntakeAppContext)

  const {
    screener_current_country_us,
    screener_live_in_canada,
    screener_work_nj,
    screener_military_service_eighteen_months,
    screener_currently_disabled,
    screener_federal_work_in_last_eighteen_months,
    screener_maritime_employer_eighteen_months,
  } = screenerInput || {}

  const ipInUS = true // temporary until we pull IP addresses
  const ipInNJ = true // temporary until we pull IP addresses

  // Canada claims have one phone number, so this takes precedence over other scenarios that also require calling
  if (screener_live_in_canada) {
    return (
      <DirectionalTemplate
        title={t('title_call_us')}
        warning={t('warning_canada')}
      >
        <Trans
          t={t}
          i18nKey="instructions_canada"
          components={{
            OUTSIDE_US_AGENT_NUMBER_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${OUTSIDE_US_AGENT_NUMBER}`} />
            ),
          }}
        />
        <p>{t('call_center_schedule')}</p>
      </DirectionalTemplate>
    )
  }

  // TODO: As we update this page to use the new design, the following should be removed in
  // favor of using <DirectionalTemplate>. Make sure to also remove any obsolete content strings.
  const borderStyle = 'border-bottom-1px border-base-lighter padding-bottom-4'
  return (
    <>
      <Head>
        <title>{t('page_title')}</title>
      </Head>

      <main
        id="main-content"
        className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
      >
        <h1>{t('page_title')}</h1>

        <SummaryBox>
          <SummaryBoxHeading headingLevel="h2">
            {t('info_alert.title')}
          </SummaryBoxHeading>
          <SummaryBoxContent>
            <ul className="usa-list">
              {!ipInUS && (
                <li>
                  {t('info_alert.items.ip_deny')}
                  <Link variant="nav" href={'#ip_deny'}>
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
              {screener_work_nj === 'other' && (
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

        {screener_current_country_us === false &&
          screener_live_in_canada === false && (
            <div className={borderStyle}>
              <h2 id="non_resident">{t('non_resident.heading')}</h2>
              <p>{t('non_resident.label')}</p>
            </div>
          )}

        {screener_work_nj === 'other' && (
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
      </main>
    </>
  )
}

export default ScreenerRedirect
