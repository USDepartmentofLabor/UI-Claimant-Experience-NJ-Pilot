import { ReactNode, useEffect, useMemo } from 'react'
import { Form, Formik, FormikHelpers } from 'formik'
import { Alert, FormGroup } from '@trussworks/react-uswds'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { ClaimantInput } from 'types/claimantInput'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { Routes } from 'constants/routes'
import { SubmitButton } from 'components/layouts/ClaimForm/SubmitButton/SubmitButton'
import { PreviousPageButton } from 'components/layouts/ClaimForm/PreviousPageButton/PreviousPageButton'
import { SaveAndExitLink } from 'components/layouts/ClaimForm/SaveAndExitLink/SaveAndExitLink'

// import claimFormStyles from './ClaimForm.module.scss' // TODO styles

type ClaimFormProps = {
  children: ReactNode
}

export const ClaimForm = ({ children }: ClaimFormProps) => {
  const router = useRouter()
  const { t } = useTranslation('claimForm')

  const currentPath = router.pathname
  const currentPageDefinition = pageDefinitions.find(
    (pageDefinition) => pageDefinition.path == currentPath
  )

  if (!currentPageDefinition) {
    // TODO: Use a unified designed error page (though this should never happen)
    return (
      <Alert
        type="error"
        headingLevel="h4"
        data-testid="missing-page-definition-alert"
      >{`No definition for page at ${currentPath}`}</Alert>
    )
  }

  const currentPageIndex = pageDefinitions.indexOf(currentPageDefinition)
  const previousPageIndex = currentPageIndex - 1
  const nextPageIndex = currentPageIndex + 1

  const previousPageDefinition =
    previousPageIndex >= 0 ? pageDefinitions.at(previousPageIndex) : undefined
  const nextPageDefinition = pageDefinitions.at(nextPageIndex)
  const isComplete = false // TODO register when claim is completed
  const isLoading = false // TODO From useSubmitClaim.isLoading

  const initialValues = useMemo(
    // TODO merge with previously saved values for all pages (When API and persistence are added)
    () =>
      pageDefinitions
        .flatMap((pageDefinition) => pageDefinition.initialValues)
        .reduce((previousValue, currentValue) => ({
          ...previousValue,
          ...currentValue,
        })),
    [pageDefinitions]
  )

  const validationSchema = currentPageDefinition.validationSchema

  const saveFormValues = (values: ClaimantInput) => {
    // TODO: The following simulates a save. Replace with API save
    console.log('saving...', values)
    return new Promise((resolve) =>
      setTimeout(() => {
        console.log('...saved!', { status: 200, ...values })
        resolve(values)
      }, 1000)
    )
  }

  const handleSaveAndExit = async (values: ClaimantInput) => {
    // TODO: Actually save and exit
    saveFormValues(values).then(() => {
      // TODO: Let the user know, the claim was saved
      //       Note: This may finish after the redirect})
    })
    await router.push(Routes.HOME)
  }

  const handleSubmit = async (
    values: ClaimantInput,
    helpers: FormikHelpers<ClaimantInput>
  ) => {
    saveFormValues(values).then(() => {
      // TODO: Let the user know, the claim was saved
      //       Note: This may finish after a redirect
    })
    helpers.setSubmitting(false)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        setErrors,
        touched,
        submitCount,
        validateForm,
        isValid,
        submitForm,
        resetForm,
      }) => {
        const showErrors =
          submitCount > 0 &&
          Object.keys(touched).length > 0 &&
          Object.keys(errors).length > 0

        // TODO: To resolve "act" warnings in unit tests, use a loader/spinner
        //       and only show the form when renders like this are complete
        useEffect(() => {
          // Whenever the component loads a new page (validationSchema changes),
          // validate the page against the new schema
          validateForm().then((validationErrors) => setErrors(validationErrors))
        }, [validationSchema])

        const handleClickPrevious = async () => {
          saveFormValues(values).then(() => {
            // TODO: Let the user know, the claim was saved
            //       Note: This may finish after the redirect
          })
          if (previousPageDefinition) {
            await router.push(previousPageDefinition.path)
          }
        }

        const handleClickNext = () => {
          submitForm().then(async () => {
            if (isValid && nextPageDefinition) {
              await router.push(nextPageDefinition.path)
              resetForm({
                values,
                submitCount: 0,
                touched: {},
              })
            }
          })
        }

        const handleClickComplete = () => {
          if (!isValid) {
            resetForm({
              submitCount: submitCount + 1,
            })
          } else {
            submitForm().then(async () => {
              await router.push(Routes.HOME)
            })
          }
        }

        return (
          <Form>
            {showErrors && (
              <FormErrorSummary key={submitCount} errors={errors} />
            )}
            {children}
            {/*<div className={claimFormStyles.pagination}> TODO fix styles*/}
            <div>
              {/* TODO ClaimFormPagination Component? */}
              <FormGroup>
                {nextPageDefinition && (
                  <div className="text-center text-italic margin-bottom-2">
                    {t('pagination.next_step', {
                      stepName: nextPageDefinition.heading,
                    })}
                  </div>
                )}
                <div className="text-center">
                  {previousPageDefinition && (
                    <PreviousPageButton onClick={handleClickPrevious} />
                  )}
                  <SubmitButton
                    disabled={isLoading}
                    onClick={
                      nextPageDefinition ? handleClickNext : handleClickComplete
                    }
                  >
                    {nextPageDefinition
                      ? t('pagination.next')
                      : t('pagination.complete')}
                  </SubmitButton>
                  <div className="margin-top-1">
                    {!isComplete && (
                      <SaveAndExitLink
                        onClick={() => handleSaveAndExit(values)}
                      />
                    )}
                  </div>
                </div>
              </FormGroup>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
