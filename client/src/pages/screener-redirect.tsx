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
  IconList,
  IconListItem,
  IconListIcon,
  IconListContent,
  IconListTitle,
  Icon,
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
import { Routes } from 'constants/routes'
import { getScreenerScenario } from 'utils/screenerScenario/getScreenerScenario'

function PageWrapper(props: { children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      className="maxw-tablet margin-x-auto desktop:margin-x-0 margin-bottom-3 desktop:grid-col-8"
    >
      {props.children}
    </main>
  )
}

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
      <PageWrapper>
        <h1>{props.title}</h1>
        {props.warning && (
          <Alert type="warning" headingLevel="h2" role="alert" slim>
            {props.warning}
          </Alert>
        )}
        {props.children}
        {props.action && <div className="margin-top-4">{props.action}</div>}
      </PageWrapper>
    </>
  )
}

function ApplyOnLegacyApp() {
  const { t } = useTranslation('redirect')

  return (
    <>
      <Head>
        <title>{t('title_apply_online')}</title>
      </Head>
      <PageWrapper>
        <h1>{t('title_apply_online')}</h1>
        <IconList className="nj-icon-list">
          <IconListItem>
            <IconListIcon>
              <Icon.Schedule />
            </IconListIcon>
            <IconListContent>
              <IconListTitle type="h2">
                {t('legacy.plan_time_heading')}
              </IconListTitle>
              <p>{t('legacy.plan_time')}</p>
            </IconListContent>
          </IconListItem>
          <IconListItem>
            <IconListIcon>
              <Icon.FolderOpen />
            </IconListIcon>
            <IconListContent>
              <IconListTitle type="h2">
                {t('legacy.required_info_heading')}
              </IconListTitle>
              <Trans
                t={t}
                i18nKey="legacy.required_info"
                components={{
                  // eslint-disable-next-line jsx-a11y/heading-has-content
                  subhead: <h3 className="nj-h5 margin-bottom-1" />,
                  ul: <ul className="usa-list margin-top-0" />,
                  li: <li />,
                }}
              />
            </IconListContent>
          </IconListItem>
        </IconList>
        <a
          href={Routes.LEGACY_APPLICATION}
          target="_blank"
          rel="noopener noreferrer"
          className="usa-button line-height-ui-3 margin-top-4"
        >
          {t('legacy.apply_button')}
          <Icon.Launch
            size={3}
            className="text-middle margin-top-neg-05 margin-left-2"
            aria-hidden="true"
          />
        </a>
      </PageWrapper>
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

  const { screener_currently_disabled } = screenerInput || {}

  const ipInUS = true // temporary until we pull IP addresses
  const ipInNJ = true // temporary until we pull IP addresses

  // Canada claims have one phone number, so this takes precedence over other scenarios that also require calling
  const screenerScenario = getScreenerScenario(screenerInput)

  if (screenerScenario === 'INELIGIBLE_OUTSIDE_US_CANADA') {
    return (
      <DirectionalTemplate
        title={t('title_not_qualified')}
        warning={t('non_resident.warning')}
      >
        <p>{t('non_resident.instructions')}</p>
      </DirectionalTemplate>
    )
  }

  if (screenerScenario === 'CANADA_CALL') {
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
        <p>
          {t('call_center_schedule')} {t('call_center_schedule_extended')}
        </p>
      </DirectionalTemplate>
    )
  }

  if (screenerScenario === 'MARITIME_CALL') {
    return (
      <DirectionalTemplate
        title={t('title_apply_via_phone')}
        warning={t('warning_maritime')}
      >
        <Trans
          t={t}
          i18nKey="instructions_call_within_us"
          components={{
            OUTSIDE_US_AGENT_NUMBER_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${OUTSIDE_US_AGENT_NUMBER}`} />
            ),
            CLAIMS_AGENT_NUMBER_1_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${CLAIMS_AGENT_NUMBER_1}`} />
            ),
            CLAIMS_AGENT_NUMBER_2_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${CLAIMS_AGENT_NUMBER_2}`} />
            ),
            CLAIMS_AGENT_NUMBER_3_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${CLAIMS_AGENT_NUMBER_3}`} />
            ),
          }}
        />
        <p>
          {t('call_center_schedule')} {t('call_center_schedule_extended')}
        </p>
      </DirectionalTemplate>
    )
  }

  if (screenerScenario === 'INELIGIBLE_WORK_OUTSIDE_NJ') {
    return (
      <DirectionalTemplate
        title={t('title_predict_denial')}
        warning={t('other_state.warning')}
      >
        <Trans
          t={t}
          i18nKey="other_state.instructions"
          components={{
            DOL_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={Routes.DOL_UNEMPLOYMENT_INFO}
              ></a>
            ),
          }}
        />
      </DirectionalTemplate>
    )
  }

  if (screenerScenario === 'MILITARY') {
    return (
      <DirectionalTemplate
        title={t('title_apply_via_phone')}
        warning={t('warning_military')}
      >
        <Trans
          t={t}
          i18nKey="instructions_call_within_us"
          components={{
            OUTSIDE_US_AGENT_NUMBER_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${OUTSIDE_US_AGENT_NUMBER}`} />
            ),
            CLAIMS_AGENT_NUMBER_1_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${CLAIMS_AGENT_NUMBER_1}`} />
            ),
            CLAIMS_AGENT_NUMBER_2_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${CLAIMS_AGENT_NUMBER_2}`} />
            ),
            CLAIMS_AGENT_NUMBER_3_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${CLAIMS_AGENT_NUMBER_3}`} />
            ),
          }}
        />
        <p>{t('call_center_schedule')}</p>
      </DirectionalTemplate>
    )
  }

  if (screenerScenario === 'FEDERAL_STANDARD_FORM') {
    return <ApplyOnLegacyApp />
  }

  // TODO: As we update this page to use the new design, the following should be removed in
  // favor of using <DirectionalTemplate>. Make sure to also remove any obsolete content strings.
  const borderStyle = 'border-bottom-1px border-base-lighter padding-bottom-4'
  return (
    <>
      <Head>
        <title>{t('page_title')}</title>
      </Head>

      <PageWrapper>
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
            </ul>
          </SummaryBoxContent>
        </SummaryBox>

        {!ipInUS && (
          <div className={borderStyle}>
            <h2 id="ip_deny">{t('ip_deny.heading')}</h2>
            <p>{t('ip_deny.label')}</p>
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
      </PageWrapper>
    </>
  )
}

export default ScreenerRedirect
