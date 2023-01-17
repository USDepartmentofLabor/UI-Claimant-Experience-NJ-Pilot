import {
  MouseEventHandler,
  ReactNode,
  useState,
  useContext,
  useRef,
} from 'react'
import { object, string } from 'yup'
import { useRouter } from 'next/router'
import { Form, Formik, FormikHelpers } from 'formik'
import type { NextPageWithLayout } from 'pages/_app'
import { useTranslation } from 'react-i18next'
import TextField from 'components/form/fields/TextField/TextField'
import { IntakeAppLayout } from 'components/layouts/IntakeAppLayout/IntakeAppLayout'
import { IntakeAppContext } from 'contexts/IntakeAppContext'
import { SsnInput } from 'types/claimantInput'
import { IntakeAppButtons } from 'components/IntakeAppButtons/IntakeAppButtons'
import { Button } from '@trussworks/react-uswds'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { Routes } from 'constants/routes'
import styles from 'styles/pages/screener.module.scss'
import { i18n_ssn } from 'i18n/i18n'
import { getFormattedSsn } from 'utils/ssn/format'

const Ssn: NextPageWithLayout = () => {
  const router = useRouter()
  const { t } = useTranslation('ssn')

  const { ssnInput, setSsn } = useContext(IntakeAppContext)
  const [showSsn, setShowSsn] = useState<boolean>(false)
  const handleToggleSsn = () => {
    setShowSsn(!showSsn)
  }

  const initialValues = { ssn: ssnInput ? String(ssnInput.ssn) : '' }
  const validationSchema = object().shape({
    ssn: string()
      .matches(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/, t('errors.badFormat'))
      .required(t('errors.required'))
      .test('ssn', t('errors.invalid'), (value) =>
        value
          ? !/^[0-9]{3}-?[0]{2}-?[0-9]{4}$/.test(value) &&
            !/^[0-9]{3}-?[0-9]{2}-?[0]{4}$/.test(value)
          : false
      ),
  })
  const handleSubmit = (values: SsnInput, helpers: FormikHelpers<SsnInput>) => {
    const { setSubmitting } = helpers
    values.ssn = getFormattedSsn(values.ssn)
    setSsn(values)
    setSubmitting(false)
  }

  return (
    <Formik<SsnInput>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, isValid, submitForm, isSubmitting, submitCount }) => {
        const validRef = useRef(isValid)
        validRef.current = isValid

        const handleClickCancel: MouseEventHandler<
          HTMLButtonElement
        > = async () => {
          await router.push(Routes.HOME) // TODO: change to Nava file a claim page when url is available
        }
        const validateSSN = () => {
          //lock the continue and cancel buttons
          //display loader message  using existing loader componenet above the navigation buttons
          //TODO --add call to ssn verificaiton service and store response
          //unlock buttons and turn off loader
          //return boolean== ssn verification call response
          return true
        }
        const handleClickNext: MouseEventHandler<HTMLButtonElement> = () => {
          const isValidSSN = validateSSN()
          if (isValidSSN) {
            submitForm().then(async () => {
              if (validRef.current) {
                await router.push(Routes.SCREENER)
              }
            })
          }
        }

        const showErrorSummary =
          submitCount > 0 && Object.keys(errors).length > 0
        return (
          <Form className={styles.screenerForm}>
            {showErrorSummary && (
              <FormErrorSummary key={submitCount} errors={errors} />
            )}
            <div className="margin-bottom-8 maxw-desktop maxw-mobile maxw-tablet">
              <TextField
                label={t('label')}
                name="ssn"
                type={showSsn ? 'text' : 'password'}
                maxLength={11}
                minLength={9}
                className="maxw-desktop  maxw-mobile maxw-tablet"
              />
              <div className="text-right">
                <button
                  className="usa-button usa-button--unstyled text-right"
                  type="button"
                  data-testid="toggleShowNumber"
                  onClick={handleToggleSsn}
                >
                  {showSsn ? t('hideSsn') : t('showSsn')}
                </button>
              </div>
            </div>
            <IntakeAppButtons>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleClickCancel}
                data-testid="back-button"
                className="usa-button usa-button--outline width-auto"
              >
                {t('pagination.previous')}
              </Button>
              <Button
                type="submit"
                onClick={handleClickNext}
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

Ssn.getLayout = (page: ReactNode) => {
  return (
    <IntakeAppLayout heading={i18n_ssn.t<string>('heading')}>
      {page}
    </IntakeAppLayout>
  )
}
export default Ssn
