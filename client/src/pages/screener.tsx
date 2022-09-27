import { useFormikContext } from 'formik'
import { useTranslation, Trans } from 'react-i18next'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { boolean, object } from 'yup'
import { ClaimantInput } from 'types/claimantInput'
import { i18n_screener } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { useClearFields } from 'hooks/useClearFields'
import { ReactNode } from 'react'
import { NextPageWithLayout } from './_app'
import { ScreenerForm } from 'components/layouts/ClaimForm/ScreenerForm/ScreenerForm'

const Screener: NextPageWithLayout = () => {
  const { t } = useTranslation('screener')
  const { values } = useFormikContext<ClaimantInput>()
  const { clearField } = useClearFields()

  const handleLiveInUSChange = () => {
    if (values.screener_current_country_us === false) {
      clearField('screener_live_in_canada')
    }
  }

  const handleWorkInLast18MonthsChange = () => {
    if (values.screener_job_last_eighteen_months === true) {
      clearField('screener_all_work_nj')
    }
    clearField('screener_any_work_nj')
  }

  const handleAllWorkInNJChange = () => {
    if (values.screener_all_work_nj === false) {
      clearField('screener_any_work_nj')
    }
  }

  return (
    <>
      <YesNoQuestion
        question={t('screener_current_country_us.label')}
        name="screener_current_country_us"
        onChange={handleLiveInUSChange}
      />
      {values.screener_current_country_us === false && (
        <YesNoQuestion
          question={t('screener_live_in_canada.label')}
          name="screener_live_in_canada"
        />
      )}
      <YesNoQuestion
        question={t('screener_military_service_eighteen_months.label')}
        name="screener_military_service_eighteen_months"
      />
      <YesNoQuestion
        question={t('screener_job_last_eighteen_months.label')}
        name="screener_job_last_eighteen_months"
        onChange={handleWorkInLast18MonthsChange}
      />
      {values.screener_job_last_eighteen_months === true && (
        <YesNoQuestion
          question={<Trans t={t} i18nKey="screener_all_work_nj.label" />}
          name="screener_all_work_nj"
          onChange={handleAllWorkInNJChange}
        />
      )}
      {values.screener_all_work_nj === false && (
        <YesNoQuestion
          question={<Trans t={t} i18nKey="screener_any_work_nj.label" />}
          name="screener_any_work_nj"
        />
      )}
      <YesNoQuestion
        question={t('screener_currently_disabled.label')}
        name="screener_currently_disabled"
      />
      <YesNoQuestion
        question={t('screener_maritime_employer_eighteen_months.label')}
        name="screener_maritime_employer_eighteen_months"
      />
    </>
  )
}

Screener.getLayout = function getLayout(page: ReactNode) {
  return <ScreenerForm>{page}</ScreenerForm>
}

export const ScreenerPageDefinition: PageDefinition = {
  path: Routes.SCREENER,
  heading: i18n_screener.t('heading'),
  initialValues: {
    screener_current_country_us: undefined,
    screener_live_in_canada: undefined,
    screener_military_service_eighteen_months: undefined,
    screener_job_last_eighteen_months: undefined,
    screener_all_work_nj: undefined,
    screener_any_work_nj: undefined,
    screener_currently_disabled: undefined,
    screener_maritime_employer_eighteen_months: undefined,
  },
  validationSchema: object().shape({
    screener_current_country_us: boolean().required(
      i18n_screener.t('screener_current_country_us.errors.required')
    ),
    screener_live_in_canada: boolean().when('screener_current_country_us', {
      is: false,
      then: boolean().required(
        i18n_screener.t('screener_live_in_canada.errors.required')
      ),
    }),
    screener_military_service_eighteen_months: boolean().required(
      i18n_screener.t(
        'screener_military_service_eighteen_months.errors.required'
      )
    ),
    screener_job_last_eighteen_months: boolean().required(
      i18n_screener.t('screener_job_last_eighteen_months.errors.required')
    ),
    screener_all_work_nj: boolean().when('screener_job_last_eighteen_months', {
      is: true,
      then: boolean().required(
        i18n_screener.t('screener_all_work_nj.errors.required')
      ),
    }),
    screener_any_work_nj: boolean().when('screener_all_work_nj', {
      is: false,
      then: boolean().required(
        i18n_screener.t('screener_any_work_nj.errors.required')
      ),
    }),
    screener_currently_disabled: boolean().required(
      i18n_screener.t('screener_currently_disabled.errors.required')
    ),
    screener_maritime_employer_eighteen_months: boolean().required(
      i18n_screener.t(
        'screener_maritime_employer_eighteen_months.errors.required'
      )
    ),
  }),
}

export default Screener
