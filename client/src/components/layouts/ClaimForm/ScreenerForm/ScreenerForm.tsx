import { MouseEventHandler, ReactNode, useRef } from 'react'
import { Form, Formik, FormikHelpers } from 'formik'
import { FormGroup } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { ScreenerInput, ClaimantInput } from 'types/claimantInput'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { Routes } from 'constants/routes'
import { SubmitButton } from 'components/layouts/ClaimForm/SubmitButton/SubmitButton'
import { PreviousPageButton } from 'components/layouts/ClaimForm/PreviousPageButton/PreviousPageButton'
import { PageHeading } from '../ClaimFormHeading/PageHeading'

import styles from './ScreenerForm.module.scss'
import Head from 'next/head'
import { ScreenerPageDefinition } from 'pages/screener'

type ScreenerFormProps = {
  children: ReactNode
}

export const ScreenerForm = ({ children }: ScreenerFormProps) => {
  const router = useRouter()
  const { t } = useTranslation('screener')
  const headingRef = useRef<HTMLHeadingElement>(null)

  const { heading, initialValues, validationSchema } = ScreenerPageDefinition

  const handleSubmit = async (
    values: ScreenerInput,
    helpers: FormikHelpers<ClaimantInput>
  ) => {
    helpers.setSubmitting(false)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {({ errors, submitCount, isValid, submitForm, setFormikState }) => {
        const showErrorSummary =
          submitCount > 0 && Object.keys(errors).length > 0

        const handleClickPrevious: MouseEventHandler<
          HTMLButtonElement
        > = async () => {
          router.push(Routes.HOME)
        }

        const handleClickNext: MouseEventHandler<HTMLButtonElement> = () => {
          if (isValid) {
            submitForm().then(async () => {
              router.push(Routes.HOME)
            })
          } else {
            setFormikState((previousState) => ({
              ...previousState,
              submitCount: submitCount + 1,
            }))
          }
        }

        return (
          <>
            <Head>
              <meta
                name="claim form"
                content="Fill out the form provided"
              ></meta>
              <title>{heading}</title>
            </Head>
            <div className="grid-row grid-gap">
              <main
                className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
                id="main-content"
              >
                <PageHeading ref={headingRef} aria-label={`${heading}`}>
                  {heading}
                </PageHeading>
                <Form className={styles.claimForm}>
                  {showErrorSummary && (
                    <FormErrorSummary key={submitCount} errors={errors} />
                  )}
                  {children}
                  <div className={styles.pagination}>
                    <FormGroup>
                      <div className="text-center">
                        <PreviousPageButton onClick={handleClickPrevious} />
                        <SubmitButton onClick={handleClickNext}>
                          {t('pagination.next')}
                        </SubmitButton>
                      </div>
                    </FormGroup>
                  </div>
                </Form>
              </main>
            </div>
          </>
        )
      }}
    </Formik>
  )
}
