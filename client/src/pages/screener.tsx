import { Formik, Form, FormikHelpers } from 'formik'
import { useTranslation, Trans } from 'react-i18next'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { boolean, object } from 'yup'
import { ScreenerInput } from 'types/claimantInput'
import { i18n_screener } from 'i18n/i18n'
import {
  ChangeEventHandler,
  MouseEventHandler,
  ReactNode,
  useContext,
  useRef,
} from 'react'
import { NextPageWithLayout } from 'pages/_app'
import { IntakeAppLayout } from 'components/layouts/IntakeAppLayout/IntakeAppLayout'
import { IntakeAppButtons } from 'components/IntakeAppButtons/IntakeAppButtons'
import { Button } from '@trussworks/react-uswds'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { Routes } from 'constants/routes'
import { useRouter } from 'next/router'
import { IntakeAppContext } from 'contexts/IntakeAppContext'
import { getClearFieldsFunctions } from 'hooks/useClearFields'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'

import styles from 'styles/pages/screener.module.scss'
import { useGetPartialClaim } from '../queries/useGetPartialClaim'

const Screener: NextPageWithLayout = () => {
  const { t } = useTranslation('screener')
  const router = useRouter()
  const { ssnInput, setScreenerInput } = useContext(IntakeAppContext)
  const { data: partialClaim } = useGetPartialClaim()
  const { appendAndSaveClaimFormValues } = useSaveClaimFormValues()

  const initialValues = {
    screener_current_country_us: undefined,
    screener_live_in_canada: undefined,
    screener_job_last_eighteen_months: undefined,
    screener_military_service_eighteen_months: undefined,
    screener_all_work_nj: undefined,
    screener_any_work_nj: undefined,
    screener_currently_disabled: undefined,
    screener_federal_work_in_last_eighteen_months: undefined,
    screener_maritime_employer_eighteen_months: undefined,
  }

  const validationSchema = object().shape({
    screener_current_country_us: boolean().required(
      i18n_screener.t('screener_current_country_us.errors.required')
    ),
    screener_live_in_canada: boolean().when('screener_current_country_us', {
      is: false,
      then: boolean().required(
        i18n_screener.t('screener_live_in_canada.errors.required')
      ),
    }),
    screener_job_last_eighteen_months: boolean().required(
      i18n_screener.t('screener_job_last_eighteen_months.errors.required')
    ),
    screener_military_service_eighteen_months: boolean()
      .required(
        i18n_screener.t(
          'screener_military_service_eighteen_months.errors.required'
        )
      )
      .when('screener_job_last_eighteen_months', {
        is: false,
        then: boolean().oneOf(
          [false],
          i18n_screener.t(
            'screener_military_service_eighteen_months.errors.job_conflict'
          )
        ),
      }),
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
    screener_federal_work_in_last_eighteen_months: boolean().required(
      i18n_screener.t(
        'screener_federal_work_in_last_eighteen_months.errors.required'
      )
    ),
    screener_maritime_employer_eighteen_months: boolean().required(
      i18n_screener.t(
        'screener_maritime_employer_eighteen_months.errors.required'
      )
    ),
  })

  const handleSubmit = (
    values: ScreenerInput,
    helpers: FormikHelpers<ScreenerInput>
  ) => {
    const { setSubmitting } = helpers
    setScreenerInput(values)
    setSubmitting(false)
  }

  return (
    <Formik<ScreenerInput>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        isValid,
        submitForm,
        isSubmitting,
        submitCount,
        getFieldMeta,
        setFieldValue,
        setFieldTouched,
      }) => {
        const { clearField, clearFields } = getClearFieldsFunctions(
          getFieldMeta,
          setFieldValue,
          setFieldTouched
        )

        const validRef = useRef(isValid)
        validRef.current = isValid

        const showErrorSummary =
          submitCount > 0 && Object.keys(errors).length > 0

        const handleCurrentCountryUSChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'yes') {
            await clearField('screener_live_in_canada')
          }
        }

        const handleJobLast18MonthsChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'no') {
            await clearFields(['screener_all_work_nj', 'screener_any_work_nj'])
          }
        }

        const handleAllWorkInNJChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'yes') {
            await clearField('screener_any_work_nj')
          }
        }

        const handleClickPrevious: MouseEventHandler<
          HTMLButtonElement
        > = async () => {
          await router.push(Routes.SSN)
        }

        const getIsRedirect = () => {
          const {
            screener_live_in_canada,
            screener_any_work_nj,
            screener_currently_disabled,
            screener_military_service_eighteen_months,
            screener_federal_work_in_last_eighteen_months,
            screener_maritime_employer_eighteen_months,
          } = values
          return (
            screener_live_in_canada !== undefined ||
            screener_any_work_nj === false ||
            screener_currently_disabled === true ||
            screener_military_service_eighteen_months === true ||
            screener_federal_work_in_last_eighteen_months === true ||
            screener_maritime_employer_eighteen_months === true
          )
        }

        const handleClickNext: MouseEventHandler<HTMLButtonElement> = (e) => {
          e.preventDefault()
          submitForm().then(async () => {
            if (validRef.current) {
              const shouldRedirect = getIsRedirect()
              if (shouldRedirect) {
                await router.push(Routes.SCREENER_REDIRECT)
              } else {
                const intakeAppValues = { ...ssnInput, ...values }
                if (
                  partialClaim !== undefined &&
                  Object.keys(intakeAppValues).length !== 0
                ) {
                  await appendAndSaveClaimFormValues(intakeAppValues)
                }
                await router.push(Routes.CLAIM.PREQUAL)
              }
            }
          })
        }

        return (
          <Form className={styles.screenerForm}>
            {showErrorSummary && (
              <FormErrorSummary key={submitCount} errors={errors} />
            )}
            <YesNoQuestion
              question={t('screener_current_country_us.label')}
              name="screener_current_country_us"
              onChange={handleCurrentCountryUSChange}
            />
            {values.screener_current_country_us === false && (
              <YesNoQuestion
                question={t('screener_live_in_canada.label')}
                name="screener_live_in_canada"
              />
            )}
            <YesNoQuestion
              question={t('screener_job_last_eighteen_months.label')}
              name="screener_job_last_eighteen_months"
              onChange={handleJobLast18MonthsChange}
            />
            <YesNoQuestion
              question={t('screener_military_service_eighteen_months.label')}
              name="screener_military_service_eighteen_months"
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
              question={t(
                'screener_federal_work_in_last_eighteen_months.label'
              )}
              name="screener_federal_work_in_last_eighteen_months"
            />
            <YesNoQuestion
              question={t('screener_maritime_employer_eighteen_months.label')}
              name="screener_maritime_employer_eighteen_months"
            />
            <IntakeAppButtons>
              <Button
                type="button"
                onClick={handleClickPrevious}
                data-testid="back-button"
                className="usa-button usa-button--outline width-auto"
              >
                {t('pagination.previous')}
              </Button>
              <Button
                type="submit"
                onClick={handleClickNext}
                disabled={isSubmitting}
                data-testid="next-button"
                className="width-auto"
              >
                {t('pagination.next')}
              </Button>
            </IntakeAppButtons>
          </Form>
        )
      }}
    </Formik>
  )
}

Screener.getLayout = (page: ReactNode) => {
  return (
    <IntakeAppLayout heading={i18n_screener.t<string>('heading')}>
      {page}
    </IntakeAppLayout>
  )
}

export default Screener
