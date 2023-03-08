import { useTranslation } from 'react-i18next'
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
} from '@trussworks/react-uswds'
import React from 'react'
import { GoToClaimFormButton } from '../GoToClaimFormButton/GoToClaimFormButton'
export const NoCurrentClaimHome = () => {
  const { t } = useTranslation('home')
  const preface2_url: string = t('preface2_link_url')
  return (
    <>
      <div className="styleguide-content usa-prose site-prose">
        <p className="padding-bottom-105">{t('preface1')}</p>
        <p className="padding-bottom-105">
          {t('preface2')}
          <strong>{t('preface2_bold')}</strong>
          {t('preface2_continued')}
          <a target="_blank" rel="noreferrer" href={preface2_url}>
            {t('preface2_link')}
          </a>
        </p>
        <p>
          {t('preface3')}
          <strong>{t('preface3_bold')}</strong>
          {t('preface3_continued')}
        </p>
        <h2 className="margin-top-neg-2">{t('how_to_apply')}</h2>
        <ProcessList>
          <ProcessListItem>
            <ProcessListHeading type={'h4'}>
              {t('process_list_1_header')}
            </ProcessListHeading>
            <p>{t('process_list_1_content')}</p>
            <li>{t('process_list_1_bullet_pi')}</li>
            <li>{t('process_list_1_bullet_alien')}</li>
            <li>
              {t('process_list_1_bullet_work_history')}
              <ul>
                <li>{t('process_list_1_wh_1_sub_emp_name')}</li>
                <li>{t('process_list_1_wh_2_sub_emp_addr')}</li>
                <li>{t('process_list_1_wh_3_sub_emp_phone')}</li>
                <li>{t('process_list_1_wh_4_sub_emp_dates')}</li>
                <li>{t('process_list_1_wh_5_sub_emp_reason')}</li>
              </ul>
            </li>
            <li>{t('process_list_1_bullet_payments')}</li>
            <li>{t('process_list_1_bullet_military')}</li>
            <li>{t('process_list_1_bullet_sf8')}</li>
            <li>{t('process_list_1_bullet_bank')}</li>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type={'h4'}>
              {t('process_list_2_header')}
            </ProcessListHeading>
            <p>{t('process_list_2_content')}</p>
          </ProcessListItem>
          <ProcessListItem>
            <ProcessListHeading type={'h4'}>
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
        <p className="font-body-3xs measure-none">
          {t('data_privacy_content')}
        </p>
        <p className="font-body-3xs measure-none">
          {t('data_privacy_continued')}
        </p>
      </div>
    </>
  )
}
