import { Trans, useTranslation } from 'react-i18next'
import {
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
} from '@trussworks/react-uswds'
import React from 'react'
import { GoToClaimFormButton } from '../../GoToClaimFormButton/GoToClaimFormButton'

export const NoCurrentClaimHome = () => {
  const { t } = useTranslation('home')
  type process_list_1_list_type = Array<
    string | { header: string; list: string[] }
  >
  const process_list_1_list: process_list_1_list_type = t(
    'process_list_1_list',
    { returnObjects: true }
  )
  return (
    <>
      <div>
        <Trans t={t} i18nKey="preface">
          <p>
            {''}
            <Link
              variant="external"
              referrerPolicy={'no-referrer'}
              target={'_blank'}
              href={t('preface_link_url')}
              aria-label={t('preface_link_aria')}
            >
              {''}
            </Link>
          </p>
        </Trans>
        <h2 className="margin-bottom-neg-05">{t('how_to_apply')}</h2>
        <ProcessList>
          <ProcessListItem>
            <ProcessListHeading type={'h3'}>
              {t('process_list_1_header')}
            </ProcessListHeading>
            <p>{t('process_list_1_content')}</p>
            <ul className="margin-top-0">
              {process_list_1_list.map((item) => {
                if (typeof item == 'string') {
                  return <li key={item}>{item}</li>
                } else {
                  return (
                    <li key={item.header}>
                      {item.header}
                      <ul>
                        {item.list.map((itemContent) => (
                          <li key={itemContent}>{itemContent}</li>
                        ))}
                      </ul>
                    </li>
                  )
                }
              })}
            </ul>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type={'h3'}>
              {t('process_list_2_header')}
            </ProcessListHeading>
            <p>{t('process_list_2_content')}</p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type={'h3'}>
              {t('process_list_3_header')}
            </ProcessListHeading>
            <p>{t('process_list_3_content')}</p>
          </ProcessListItem>
        </ProcessList>
        <SummaryBox className="bg-primary-lighter border-primary-light margin-bottom-4 margin-top-0">
          <SummaryBoxContent>
            <SummaryBoxHeading headingLevel={'h2'} className="padding-bottom-2">
              {t('screener_title')}
            </SummaryBoxHeading>
            <GoToClaimFormButton />
          </SummaryBoxContent>
        </SummaryBox>
      </div>
      <div>
        <p className="padding-bottom-1">{t('data_privacy_title')}</p>
        <Trans t={t} i18nKey={'data_privacy_content'}>
          <p className="font-body-3xs measure-none">{''}</p>
        </Trans>
      </div>
    </>
  )
}
