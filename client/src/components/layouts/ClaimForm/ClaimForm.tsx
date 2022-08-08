import { MouseEventHandler, ReactNode, useEffect, useMemo, useRef } from 'react'
import { Form, Formik, FormikHelpers } from 'formik'
import {
  Alert,
  FormGroup,
  StepIndicator,
  StepIndicatorStep,
} from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { ClaimantInput } from 'types/claimantInput'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import { Routes } from 'constants/routes'
import { SubmitButton } from 'components/layouts/ClaimForm/SubmitButton/SubmitButton'
import { PreviousPageButton } from 'components/layouts/ClaimForm/PreviousPageButton/PreviousPageButton'
import { SaveAndExitLink } from 'components/layouts/ClaimForm/SaveAndExitLink/SaveAndExitLink'
import { ClaimFormPageHeading } from './ClaimFormHeading/ClaimFormPageHeading'

import styles from './ClaimForm.module.scss'
import Head from 'next/head'

type ClaimFormProps = {
  children: ReactNode
}

export const ClaimForm = ({ children }: ClaimFormProps) => {
  const router = useRouter()
  const { t } = useTranslation('claimForm')
  const headingRef = useRef<HTMLHeadingElement>(null)

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

  const step = currentPageIndex + 1
  const totalSteps = pageDefinitions.length

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

  const focusHeading = () => {
    headingRef.current && headingRef.current.focus()
  }

  const saveFormValues = (values: ClaimantInput) => {
    // TODO: The following simulates a save. Replace with API save
    console.log('saving...', values)
    new Promise<ClaimantInput>((resolve) =>
      setTimeout(() => {
        resolve(values)
      }, 1000)
    ).then((savedValues) => {
      // TODO: Let the user know, the claim was saved
      //       Note: This may finish after the redirect})
      console.log('...saved!', { status: 200, ...savedValues })
    })
  }

  const handleSaveAndExit = async (values: ClaimantInput) => {
    saveFormValues(values)
    await router.push(Routes.HOME)
  }

  const handleSubmit = async (
    values: ClaimantInput,
    helpers: FormikHelpers<ClaimantInput>
  ) => {
    saveFormValues(values)
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
        setFormikState,
      }) => {
        const showErrorSummary =
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

        const handleClickPrevious: MouseEventHandler<
          HTMLButtonElement
        > = async () => {
          saveFormValues(values)
          if (previousPageDefinition) {
            router.push(previousPageDefinition.path).then(() => {
              setFormikState((previousState) => ({
                ...previousState,
                submitCount: 0,
              }))
              focusHeading()
            })
          }
        }

        const handleClickNext: MouseEventHandler<HTMLButtonElement> = () => {
          if (isValid && nextPageDefinition) {
            router.push(nextPageDefinition.path).then(() => {
              setFormikState((previousState) => ({
                ...previousState,
                submitCount: 0,
              }))
              focusHeading()
            })
          } else {
            setFormikState((previousState) => ({
              ...previousState,
              submitCount: submitCount + 1,
            }))
          }
        }

        const handleClickComplete: MouseEventHandler<
          HTMLButtonElement
        > = () => {
          if (isValid) {
            submitForm().then(async () => {
              await router.push(Routes.HOME)
            })
          } else {
            setFormikState((previousState) => ({
              ...previousState,
              submitCount: submitCount + 1,
            }))
          }
        }
        const getStatus = (index: number) => {
          if (index === currentPageIndex) return 'current'
          if (index < currentPageIndex) return 'complete'
          return undefined
        }

        return (
          <>
            <Head>
              <title>{currentPageDefinition.heading}</title>
            </Head>
            <div className="grid-row grid-gap">
              <StepIndicator
                className="overflow-hidden width-mobile-lg margin-x-auto"
                counters="none"
                headingLevel="h2"
                divProps={{
                  role: 'region',
                  'aria-label': `progress - step ${step} of ${totalSteps}`,
                }}
                data-testid="step-indicator"
              >
                {pageDefinitions.map((page, i) => (
                  <StepIndicatorStep
                    key={page.path}
                    label={page.heading}
                    status={getStatus(i)}
                  />
                ))}
              </StepIndicator>
              <main
                className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
                id="main-content"
              >
                <ClaimFormPageHeading
                  pageHeading={currentPageDefinition.heading}
                  step={step}
                  totalSteps={totalSteps}
                  ref={headingRef}
                />
                <Form className={styles.claimForm}>
                  {showErrorSummary && (
                    <FormErrorSummary key={submitCount} errors={errors} />
                  )}
                  {children}
                  <div className={styles.pagination}>
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
                            nextPageDefinition
                              ? handleClickNext
                              : handleClickComplete
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
              </main>
            </div>
          </>
        )
      }}
    </Formik>
  )
}
