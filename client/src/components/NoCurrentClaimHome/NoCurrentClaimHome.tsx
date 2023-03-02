import { useTranslation } from 'react-i18next'
import { Button, ProcessList } from '@trussworks/react-uswds'
import React from 'react'
import styles from 'styles/pages/claim/home.module.scss'
import { useRouter } from 'next/router'
import { Routes } from '../../constants/routes'
export const NoCurrentClaimHome = () => {
  const { t } = useTranslation('home')
  const preface2_url: string = t('preface2_link_url')
  const router = useRouter()

  const goToSsnPage = () => {
    router.push(Routes.SSN)
  }

  return (
    <div className="styleguide-content usa-prose site-prose">
      <div className={styles.preface}>{t('preface1')}</div>
      <div className={styles.preface}>
        {t('preface2')}
        <strong>{t('preface2_bold')}</strong>
        {t('preface2_continued')}
        <a target="_blank" rel="noreferrer" href={preface2_url}>
          {t('preface2_link')}
        </a>
      </div>
      <div>
        {t('preface3')}
        <strong>{t('preface3_bold')}</strong>
        {t('preface3_continued')}
      </div>
      <h2 className={styles.intermediateHeader}>{t('how_to_apply')}</h2>
      <ProcessList className="usa-process-list">
        <ol className="usa-process-list__item">
          <h4 className="usa-process-list__heading">
            {t('process_list_1_header')}
          </h4>
          <p>{t('process_list_1_content')}</p>
          <ul>
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
          </ul>
        </ol>
        <ol className="usa-process-list__item">
          <h4 className="usa-process-list__heading">
            {t('process_list_2_header')}
          </h4>
          <p>{t('process_list_2_content')}</p>
        </ol>
        <ol className="usa-process-list__item orderedListOverride">
          <h4 className="usa-process-list__heading">
            {t('process_list_3_header')}
          </h4>
          <p>{t('process_list_3_content')}</p>
        </ol>
        <ul className={styles.screenerBox}>
          <h2>{t('screener_title')}</h2>
          <Button type="button" id="screenerButton" onClick={goToSsnPage}>
            {t('screener_button')}
          </Button>
        </ul>
      </ProcessList>
      <p>{t('data_privacy_title')}</p>
      <small className={'line-height-body-2'}>
        {t('data_privacy_content')}
      </small>
    </div>
  )
}
