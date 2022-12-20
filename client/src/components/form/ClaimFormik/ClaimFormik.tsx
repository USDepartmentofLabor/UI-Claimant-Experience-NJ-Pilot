import { Form, Formik, FormikHelpers, FormikValues } from 'formik'
import { ComponentProps, ReactNode, useEffect, useState } from 'react'
import styles from 'components/form/ClaimFormik/ClaimFormik.module.scss'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { SaveAndExitLink } from 'components/form/ClaimFormButtons/SaveAndExitLink/SaveAndExitLink'
import { ClaimantInput } from 'types/claimantInput'
import { cognitoSignOut } from 'utils/signout/cognitoSignOut'
import { useSaveCompleteClaim } from 'queries/useSaveCompleteClaim'
import * as React from 'react'
import { FormikProps } from 'formik/dist/types'
import { ClearFieldFunction, ClearFieldsFunction } from 'types/ClearFieldTypes'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'
import { useInitialValues } from 'hooks/useInitialValues'
import PageLoader from 'components/loaders/PageLoader'
import { getClearFieldsFunctions } from 'hooks/useClearFields'

type ClaimFormikChildrenFunctionProps<Values> = {
  clearField: ClearFieldFunction
  clearFields: ClearFieldsFunction
} & FormikProps<Values>

type ClaimFormikChildrenFunction<Values> = (
  props: ClaimFormikChildrenFunctionProps<Values>
) => ReactNode

type ClaimFormikChildren<Values> =
  | ReactNode
  | ClaimFormikChildrenFunction<Values>

type ClaimFormikProps<Values extends FormikValues> = {
  children: ClaimFormikChildren<Values>
} & Omit<ComponentProps<typeof Formik<Values>>, 'onSubmit' | 'children'>

const isFunction = <Values extends FormikValues = ClaimantInput>(
  obj: any
): obj is ClaimFormikChildrenFunction<Values> => typeof obj === 'function'

export const ClaimFormik = <Values extends FormikValues = ClaimantInput>({
  children,
  initialValues,
  validationSchema,
  ...formikProps
}: ClaimFormikProps<Values>) => {
  const [isLoading, setIsLoading] = useState(true)
  const { appendAndSaveClaimFormValues } = useSaveClaimFormValues()
  const saveCompleteClaim = useSaveCompleteClaim()
  const isComplete = saveCompleteClaim.isSuccess
  const {
    initialValues: combinedInitialValues,
    isLoading: isLoadingInitialValues,
  } = useInitialValues(initialValues)

  // Wait for Initial Values to be initialized before loading the form
  useEffect(() => {
    if (!isLoadingInitialValues) {
      setIsLoading(false)
    }
  }, [isLoadingInitialValues])

  const handleSaveAndExit = (values: Values) => {
    console.log('handleSave and exdit')
    appendAndSaveClaimFormValues(values).then(
      async () => await cognitoSignOut()
    )
  }

  const handleSubmit = (values: Values, helpers: FormikHelpers<Values>) => {
    const { setSubmitting } = helpers
    appendAndSaveClaimFormValues(values).then(() => setSubmitting(false))
  }

  return isLoading ? (
    <PageLoader />
  ) : (
    <Formik<Values>
      onSubmit={handleSubmit}
      initialValues={combinedInitialValues as Values}
      validationSchema={validationSchema}
      {...formikProps}
    >
      {(formikProps) => {
        const {
          values,
          errors,
          isSubmitting,
          submitCount,
          getFieldMeta,
          setFieldValue,
          setFieldTouched,
        } = formikProps

        const { clearField, clearFields } = getClearFieldsFunctions(
          getFieldMeta,
          setFieldValue,
          setFieldTouched
        )

        const claimFormikProps: ClaimFormikChildrenFunctionProps<Values> = {
          ...formikProps,
          clearField,
          clearFields,
        }

        const showErrorSummary =
          submitCount > 0 && Object.keys(errors).length > 0

        return (
          <Form className={styles.claimForm}>
            <>
              {showErrorSummary && (
                <FormErrorSummary key={submitCount} errors={errors} />
              )}
              {isFunction<Values>(children)
                ? children(claimFormikProps)
                : children}
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
