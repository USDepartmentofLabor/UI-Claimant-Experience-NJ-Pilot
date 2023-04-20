import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  Button,
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
import { useRouter } from 'next/router'

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
          /* Include aria-live for scenario where user decides to apply anyways, but another scenario applies to them,
            so they see an update to the existing page's content instead of being routed to another page */
          <Alert
            aria-live="polite"
            type="warning"
            headingLevel="h2"
            role="alert"
            slim
          >
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
  const router = useRouter()
  const { screenerInput } = useContext(IntakeAppContext)
  const [skipDisabilityScenario, setSkipDisabilityScenario] = useState(false)

  // Canada claims have one phone number, so this takes precedence over other scenarios that also require calling
  const screenerScenario = getScreenerScenario(screenerInput, {
    skipDisabilityScenario,
  })

  useEffect(() => {
    /**
     * If skipDisabilityScenario results in a NEW_FORM scenario,
     * we want to redirect the user to the intake app.
     */
    if (screenerScenario === 'NEW_FORM') {
      router.push(pageDefinitions[0].path)
    }

    /**
     * If the user refreshes their page, we lose the screener form state
     */
    if (!screenerInput) {
      router.push(Routes.SCREENER)
    }
  }, [router, screenerScenario, screenerInput])

  if (screenerScenario === 'DISABILITY') {
    return (
      <DirectionalTemplate
        title={t('title_predict_denial')}
        warning={t('warning_disabled')}
      >
        <Trans
          t={t}
          i18nKey="instructions_disabled"
          components={{
            APPLY_BUTTON: (
              // @ts-expect-error `children` will be set in i18n string
              <Button
                type="button"
                unstyled
                onClick={() => setSkipDisabilityScenario(true)}
              />
            ),
            TEMPORARY_DISABILITY_INSURANCE_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href={Routes.TEMPORARY_DISABILITY_INSURANCE}
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
            DISABILITY_BENEFITS_AGENT_NUMBER_LINK: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={`tel:${DISABILITY_BENEFITS_AGENT_NUMBER}`} />
            ),
          }}
        />
      </DirectionalTemplate>
    )
  }

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

  // Serves as the catch all for when previous screener scenarios are not met
  return <Link href={pageDefinitions[0].path}>{t('apply_now')}</Link>
}

export default ScreenerRedirect
