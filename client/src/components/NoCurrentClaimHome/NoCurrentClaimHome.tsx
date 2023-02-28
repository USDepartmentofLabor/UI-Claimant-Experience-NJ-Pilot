import { useTranslation } from 'react-i18next'
import {Button, ProcessList} from '@trussworks/react-uswds'
import React from 'react'
export const NoCurrentClaimHome = () => {
  const { t } = useTranslation('home')

  return (
    <>
      <div style={{ paddingBottom: '1.5em' }}>{t('preface1')}</div>
      <div style={{ paddingBottom: '1.5em' }}>
        {t('preface2')}
        <span style={{ fontWeight: 'bold' }}>{t('preface2_bold')}</span>
        {t('preface2_continued')}
        <span style={{ color: 'blue' }}>{t('preface2_link')}</span>
      </div>
      <div style={{ paddingBottom: '1.5em' }}>
        {t('preface3')}
        <span style={{ fontWeight: 'bold' }}>{t('preface3_bold')}</span>
        {t('preface3_continued')}
      </div>
      <h1>{t('how_to_apply')}</h1>
        <ProcessList className="usa-process-list">
          <ol className="usa-process-list__item">
            <h4>{t('process_list_1_header')}</h4>
            <p>{t('process_list_1_content')}</p>
            <ul>
              <li>{t('process_list_1_bullet_pi')}</li>
              <li>{t('process_list_1_bullet_alien')}</li>
              <li>{t('process_list_1_bullet_work_history')}
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
            <h4>{t('process_list_2_header')}</h4>
            <p>{t('process_list_2_content')}</p>
          </ol>
          <ol className="usa-process-list__item">
            <h4>{t('process_list_3_header')}</h4>
            <p>{t('process_list_3_content')}</p>
          </ol>
        </ProcessList>
      <div>
        <h3>{t('screener_title')}</h3>
        <Button type="button" id="screenerButton">{t('screener_button')}</Button>
      </div>
      <h5>{t('data_privacy_title')}</h5>
      <div>{t('data_privacy_content')}</div>
    </>
  )
}
