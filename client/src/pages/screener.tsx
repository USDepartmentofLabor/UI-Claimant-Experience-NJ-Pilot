import { Formik, Form, FormikHelpers } from 'formik'
import { useTranslation } from 'react-i18next'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { boolean, string, object } from 'yup'
import { ScreenerInput } from 'types/claimantInput'
import { i18n_screener } from 'i18n/i18n'
import {
  ChangeEventHandler,
  MouseEventHandler,
  ReactNode,
  useContext,
} from 'react'
import { NextPageWithLayout } from 'pages/_app'
import { IntakeAppLayout } from 'components/layouts/IntakeAppLayout/IntakeAppLayout'
import { IntakeAppButtons } from 'components/IntakeAppButtons/IntakeAppButtons'
import { Button } from '@trussworks/react-uswds'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { workOptions } from 'constants/formOptions'
import { Routes } from 'constants/routes'
import { useRouter } from 'next/router'
import { IntakeAppContext } from 'contexts/IntakeAppContext'
import { getClearFieldsFunctions } from 'hooks/useClearFields'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'
import formStyles from 'components/form/form.module.scss'
import styles from 'styles/pages/screener.module.scss'
import { useGetPartialClaim } from '../queries/useGetPartialClaim'
import { UNTOUCHED_RADIO_VALUE } from 'constants/formOptions'
import { merge } from 'lodash'

import { PartialClaimResponseType } from 'types/ResponseTypes'

export const pageInitialValues = {
  screener_current_country_us: UNTOUCHED_RADIO_VALUE,
  screener_live_in_canada: UNTOUCHED_RADIO_VALUE,
  screener_job_last_eighteen_months: UNTOUCHED_RADIO_VALUE,
  screener_military_service_eighteen_months: UNTOUCHED_RADIO_VALUE,
  screener_work_nj: UNTOUCHED_RADIO_VALUE,
  screener_currently_disabled: UNTOUCHED_RADIO_VALUE,
  screener_federal_work_in_last_eighteen_months: UNTOUCHED_RADIO_VALUE,
  screener_maritime_employer_eighteen_months: UNTOUCHED_RADIO_VALUE,
}

const Screener: NextPageWithLayout = () => {
  const { t } = useTranslation('screener')
  const router = useRouter()
  const { ssnInput, setScreenerInput } = useContext(IntakeAppContext)
  const { data: partialClaim } = useGetPartialClaim()
  const { appendAndSaveClaimFormValues } = useSaveClaimFormValues()

  const validationSchema = object().shape({
    screener_current_country_us: boolean()
      .nullable()
      .required(i18n_screener.t('screener_current_country_us.errors.required')),
    screener_live_in_canada: boolean()
      .nullable()
      .when('screener_current_country_us', {
        is: false,
        then: (schema) =>
          schema.required(
            i18n_screener.t('screener_live_in_canada.errors.required')
          ),
      }),
    screener_job_last_eighteen_months: boolean()
      .nullable()
      .required(
        i18n_screener.t('screener_job_last_eighteen_months.errors.required')
      ),
    screener_military_service_eighteen_months: boolean()
      .nullable()
      .required(
        i18n_screener.t(
          'screener_military_service_eighteen_months.errors.required'
        )
      )
      .when('screener_job_last_eighteen_months', {
        is: false,
        then: (schema) =>
          schema.oneOf(
            [false],
            i18n_screener.t(
              'screener_military_service_eighteen_months.errors.job_conflict'
            )
          ),
      }),
    screener_work_nj: string()
      .nullable()
      .when('screener_job_last_eighteen_months', {
        is: true,
        then: (schema) =>
          schema
            .oneOf([...workOptions])
            .required(i18n_screener.t('screener_work_nj.errors.required')),
      }),
    screener_currently_disabled: boolean()
      .nullable()
      .required(i18n_screener.t('screener_currently_disabled.errors.required')),
    screener_federal_work_in_last_eighteen_months: boolean()
      .nullable()
      .required(
        i18n_screener.t(
          'screener_federal_work_in_last_eighteen_months.errors.required'
        )
      ),
    screener_maritime_employer_eighteen_months: boolean()
      .nullable()
      .required(
        i18n_screener.t(
          'screener_maritime_employer_eighteen_months.errors.required'
        )
      ),
  })
  const removeConditionalsFromPartialClaim = (
    partialClaim: PartialClaimResponseType
  ) => {
    if (
      partialClaim?.screener_job_last_eighteen_months &&
      partialClaim?.screener_work_nj !== undefined
    ) {
      partialClaim.screener_work_nj = undefined
    }
    if (
      partialClaim?.screener_current_country_us &&
      partialClaim?.screener_live_in_canada !== undefined
    ) {
      partialClaim.screener_work_nj = undefined
    }
    return partialClaim
  }

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
      initialValues={pageInitialValues}
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
        const { clearField } = getClearFieldsFunctions(
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
            await clearField(
              'screener_live_in_canada',
              pageInitialValues.screener_live_in_canada
            )
          }
        }

        const handleJobLast18MonthsChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'no') {
            await clearField(
              'screener_work_nj',
              pageInitialValues.screener_work_nj
            )
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
            screener_work_nj,
            screener_currently_disabled,
            screener_military_service_eighteen_months,
            screener_federal_work_in_last_eighteen_months,
            screener_maritime_employer_eighteen_months,
          } = values
          return (
            screener_live_in_canada !== null ||
            screener_work_nj === 'other' ||
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
                const ssnToUse = ssnInput?.ssn
                  ? ssnInput.ssn
                  : partialClaim?.ssn
                  ? partialClaim.ssn
                  : ''

                const intakeAppValues = { ...{ ssn: ssnToUse }, ...values }
                if (
                  partialClaim !== undefined &&
                  Object.keys(intakeAppValues).length !== 0
                ) {
                  //set claim form values and merge with get partial claim
                  const modifiedClaim =
                    removeConditionalsFromPartialClaim(partialClaim)
                  merge(modifiedClaim, intakeAppValues)
                  await appendAndSaveClaimFormValues(partialClaim)
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
              <RadioField
                name="screener_work_nj"
                legend={t('screener_work_nj.label')}
                className={formStyles.field}
                options={workOptions.map((option) => {
                  return {
                    label: t(`screener_work_nj.options.${option}`),
                    value: option,
                  }
                })}
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
