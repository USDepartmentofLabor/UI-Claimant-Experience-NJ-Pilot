import { ComponentProps, ReactNode, useRef } from 'react'
import { Form, Formik, FormikHelpers } from 'formik'
import { Employer } from 'types/claimantInput'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'
import styles from 'components/form/EmployerFormik/EmployerFormik.module.scss'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { SaveAndExitLink } from 'components/form/ClaimFormButtons/SaveAndExitLink/SaveAndExitLink'
import * as React from 'react'
import { cognitoSignOut } from 'utils/signout/cognitoSignOut'
import { useSaveCompleteClaim } from 'queries/useSaveCompleteClaim'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { PageHeading } from 'components/form/ClaimFormHeading/PageHeading'
import { useTranslation } from 'react-i18next'

type ClaimFormikProps = {
  children: ReactNode
  index: string
  pageIndex: number
  heading: string
} & Omit<ComponentProps<typeof Formik<Employer>>, 'onSubmit' | 'children'>

export const EmployerFormik = ({
  children,
  index,
  pageIndex,
  heading,
  initialValues,
  validationSchema,
}: ClaimFormikProps) => {
  const { t } = useTranslation('claimForm')
  const saveCompleteClaim = useSaveCompleteClaim()
  const isComplete = saveCompleteClaim.isSuccess

  const { modifyEmployerAndSaveClaimFormValues } = useSaveClaimFormValues()

  const handleSubmit = async (
    values: Employer,
    helpers: FormikHelpers<Employer>
  ) => {
    const { setSubmitting } = helpers
    await modifyEmployerAndSaveClaimFormValues(values, index)
    setSubmitting(false)
  }

  const handleSaveAndExit = (values: Employer) => {
    modifyEmployerAndSaveClaimFormValues(values, index).then(
      async () => await cognitoSignOut()
    )
  }

  const step = pageIndex + 1
  const totalStep = pageDefinitions.length
  const headingRef = useRef<HTMLHeadingElement>(null)

  return (
    <>
      <PageHeading
        ref={headingRef}
        aria-label={`${heading} ${t('step_progress', {
          step,
          totalStep,
        })}`}
      >
        {heading}
      </PageHeading>
      <Formik<Employer>
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {(formikProps) => {
          const { values, errors, isSubmitting, submitCount } = formikProps
          const showErrorSummary =
            submitCount > 0 && Object.keys(errors).length > 0

          return (
            <Form className={styles.claimForm}>
              <>
                {showErrorSummary && (
                  <FormErrorSummary key={submitCount} errors={errors} />
                )}
                {children}
                <div className="margin-top-1 text-center">
                  {!isComplete && (
                    <SaveAndExitLink
                      disabled={isSubmitting}
                      onClick={() => handleSaveAndExit(values)}
                    />
                  )}
                </div>
              </>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}
