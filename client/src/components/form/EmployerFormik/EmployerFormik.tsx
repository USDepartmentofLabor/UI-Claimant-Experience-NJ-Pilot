import { ComponentProps, ReactNode } from 'react'
import { Form, Formik, FormikHelpers } from 'formik'
import { Employer } from 'types/claimantInput'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'
import styles from 'components/form/EmployerFormik/EmployerFormik.module.scss'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { SaveAndExitLink } from 'components/form/ClaimFormButtons/SaveAndExitLink/SaveAndExitLink'
import * as React from 'react'
import { cognitoSignOut } from 'utils/signout/cognitoSignOut'
import { useSaveCompleteClaim } from 'queries/useSaveCompleteClaim'

type ClaimFormikProps = {
  children: ReactNode
  index: string
} & Omit<ComponentProps<typeof Formik<Employer>>, 'onSubmit' | 'children'>

export const EmployerFormik = ({
  children,
  index,
  initialValues,
  validationSchema,
}: ClaimFormikProps) => {
  const saveCompleteClaim = useSaveCompleteClaim()
  const isComplete = saveCompleteClaim.isSuccess

  const { modifyEmployerAndSaveClaimFormValues } = useSaveClaimFormValues()

  const handleSubmit = (values: Employer, helpers: FormikHelpers<Employer>) => {
    const { setSubmitting } = helpers
    modifyEmployerAndSaveClaimFormValues(values, index).then(() =>
      setSubmitting(false)
    )
  }

  const handleSaveAndExit = (values: Employer) => {
    modifyEmployerAndSaveClaimFormValues(values, index).then(
      async () => await cognitoSignOut()
    )
  }

  return (
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
  )
}
