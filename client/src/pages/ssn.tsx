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
import { Button, Modal, ModalRef } from '@trussworks/react-uswds'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { Routes } from 'constants/routes'
import styles from 'styles/pages/screener.module.scss'
import { i18n_ssn } from 'i18n/i18n'
import { getFormattedSsn } from 'utils/ssn/format'
import { useValidateSSN } from 'queries/useValidateSSN'
import { merge } from 'lodash'

const useInitialValues = () => {
  const { ssnInput } = useContext(IntakeAppContext)
  const initialValues = { ssn: '' } as SsnInput

  merge(initialValues, ssnInput)
  return {
    initialValues,
  }
}
const Ssn: NextPageWithLayout = () => {
  const router = useRouter()
  const { t } = useTranslation('ssn')
  const { setSsn } = useContext(IntakeAppContext)
  const [showSsn, setShowSsn] = useState<boolean>(false)
  const [disableButtons, setDisableButtons] = useState<boolean>(false)
  const validateSSN = useValidateSSN()
  const handleToggleSsn = () => {
    setShowSsn(!showSsn)
  }
  const { initialValues } = useInitialValues()

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

  const handleSubmit = async (
    values: SsnInput,
    helpers: FormikHelpers<SsnInput>
  ) => {
    const { setSubmitting } = helpers
    values.ssn = getFormattedSsn(values.ssn)
    setSsn(values)
    setSubmitting(false)
  }
  const modalRef = useRef<ModalRef>(null)
  return (
    <Formik<SsnInput>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, isValid, submitForm, isSubmitting, submitCount, values }) => {
        const validRef = useRef(isValid)
        validRef.current = isValid
        const isLoadingSSN = isSubmitting || disableButtons

        const handleClickCancel: MouseEventHandler<
          HTMLButtonElement
        > = async () => {
          await router.push(Routes.HOME) // TODO: change to Nava file a claim page when url is available
        }

        const closeModal = () => {
          if (modalRef.current !== null) {
            modalRef.current.toggleModal(undefined, false)
          }
        }
        const openModal = () => {
          if (modalRef.current !== null) {
            modalRef.current.toggleModal(undefined, true)
          }
        }
        const lockButtonsAndVerifySSN = async () => {
          if (values.ssn) {
            setDisableButtons(true)
            openModal()
            const validateSSNResult = await validateSSN.mutateAsync(values.ssn)

            return validateSSNResult.status === 200
            //TODO - change this to handle error states
          }
          return false
        }

        const handleClickNext: MouseEventHandler<
          HTMLButtonElement
        > = async () => {
          submitForm().then(async () => {
            if (validRef.current) {
              const isVerifiedSSN = await lockButtonsAndVerifySSN()
              if (isVerifiedSSN) {
                router.push(Routes.SCREENER).then(() => {
                  closeModal()
                })
              } else {
                setDisableButtons(false)
                closeModal()
              }
            }
          })
        }

        const showErrorSummary =
          submitCount > 0 && Object.keys(errors).length > 0
        return (
          <Form className={styles.screenerForm}>
            {showErrorSummary && (
              <FormErrorSummary key={submitCount} errors={errors} />
            )}
            <div className="margin-bottom-1">
              <TextField
                label={t('label')}
                name="ssn"
                type={showSsn ? 'text' : 'password'}
                maxLength={11}
                minLength={9}
                className=""
              />
              <div className="text-right maxw-mobile-lg">
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
                disabled={isLoadingSSN}
                onClick={handleClickCancel}
                data-testid="back-button"
                className="usa-button usa-button--outline width-auto"
              >
                {t('pagination.previous')}
              </Button>
              <Button
                type="submit"
                onClick={handleClickNext}
                disabled={isLoadingSSN}
                data-testid="next-button"
                className="width-auto"
              >
                {t('pagination.next')}
              </Button>
            </IntakeAppButtons>
            {isLoadingSSN && (
              <Modal ref={modalRef} id={'ssn-loading-modal'} isInitiallyOpen>
                <h3>{t('loading')}</h3>
              </Modal>
            )}
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
