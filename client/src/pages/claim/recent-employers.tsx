import { useTranslation } from 'next-i18next'
import { useGetRecentEmployers } from 'queries/useGetRecentEmployers'
import { formatLast18monthsEmployersDate } from 'utils/date/format'
import {
  Alert,
  Fieldset,
  SummaryBox,
  SummaryBoxContent,
} from '@trussworks/react-uswds'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import { RecentEmployersPageDefinition } from 'constants/pages/definitions/recentEmployersPageDefinition'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { ReactNode, useContext, useMemo, useRef } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { Routes } from 'constants/routes'
import { EditEmployerPageDefinition } from 'constants/pages/definitions/editEmployerPageDefinition'
import {
  findFirstImportedEmployerIndex,
  mergeEmployers,
  transformWgpmEmployer,
} from 'utils/employer/employerUtils'
import { Form, Formik, FormikHelpers } from 'formik'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import * as React from 'react'
import { SaveAndExitLink } from 'components/form/ClaimFormButtons/SaveAndExitLink/SaveAndExitLink'
import { cognitoSignOut } from 'utils/signout/cognitoSignOut'
import PageLoader from 'components/loaders/PageLoader'
import styles from 'components/form/ClaimFormik/ClaimFormik.module.scss'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'
import { PageHeading } from 'components/form/ClaimFormHeading/PageHeading'
import { Employer } from 'types/claimantInput'
import Error from 'next/error'
import { useRouter } from 'next/router'
const pageDefinition = RecentEmployersPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)
const step = pageDefinitions.indexOf(RecentEmployersPageDefinition) + 1
const totalStep = pageDefinitions.length

type RecentEmployerValues = {
  recent_employers: Employer[]
}

// TODO: Prevent claimant from using the same FEIN on multiple employers
export const RecentEmployers: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')
  const { t: tCommon } = useTranslation('common')
  const router = useRouter()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { claimFormValues } = useContext(ClaimFormContext)
  const {
    data: wgpmEmployers,
    isLoading: isLoadingRecentEmployers,
    isError: isRecentEmployersError,
    error: recentEmployerError,
  } = useGetRecentEmployers()
  const { appendAndSaveClaimFormValues } = useSaveClaimFormValues()
  const date = formatLast18monthsEmployersDate(String(new Date()))

  const handleSaveRecentEmployers = async (values: RecentEmployerValues) => {
    const importedEmployers = values.recent_employers
    const manuallyAddedEmployers =
      claimFormValues?.employers?.filter((employer) => !employer.is_imported) ||
      []

    const reconciledEmployers = [
      ...importedEmployers,
      ...manuallyAddedEmployers,
    ]

    await appendAndSaveClaimFormValues({
      employers: reconciledEmployers,
    })
  }

  const handleSaveAndExit = (values: RecentEmployerValues) => {
    handleSaveRecentEmployers(values).then(async () => await cognitoSignOut())
  }

  const handleSubmit = async (
    values: RecentEmployerValues,
    helpers: FormikHelpers<RecentEmployerValues>
  ) => {
    const { setSubmitting } = helpers
    await handleSaveRecentEmployers(values)
    setSubmitting(false)
  }

  if (isLoadingRecentEmployers) {
    return <PageLoader />
  } else if (
    isRecentEmployersError &&
    recentEmployerError?.response?.status === 400
  ) {
    router.push(Routes.SSN)
    return null
  } else if (
    isRecentEmployersError &&
    recentEmployerError?.response?.status !== 503
  ) {
    return <Error title={tCommon('errorStatus.500')} statusCode={500} />
  } else {
    const calculateInitialValues = (): RecentEmployerValues => {
      const transformedWgpmEmployers =
        wgpmEmployers === undefined
          ? []
          : wgpmEmployers.map((wgpmEmployer) =>
              transformWgpmEmployer(wgpmEmployer)
            )
      const previouslyImportedEmployers = claimFormValues?.employers?.filter(
        (employer) => employer.is_imported
      )
      const recentEmployers = mergeEmployers(
        transformedWgpmEmployers,
        previouslyImportedEmployers
      )
      return {
        recent_employers: recentEmployers,
      }
    }

    return (
      <>
        <PageHeading
          ref={headingRef}
          aria-label={`${pageDefinition.heading} ${t('step_progress', {
            step,
            totalStep,
          })}`}
        >
          {pageDefinition.heading}
        </PageHeading>
        <Formik<RecentEmployerValues>
          onSubmit={handleSubmit}
          initialValues={calculateInitialValues()}
          validationSchema={pageDefinition.validationSchema}
        >
          {({ values, errors, submitCount, isSubmitting }) => {
            const firstImportedEmployerIndex = findFirstImportedEmployerIndex(
              values.recent_employers
            )

            const { nextPageLocal, nextStep } = useMemo(() => {
              if (firstImportedEmployerIndex === -1) {
                return {
                  nextPageLocal: nextPage.path,
                  nextStep: nextPage.heading,
                }
              }
              return {
                nextPageLocal: `${Routes.CLAIM.EDIT_EMPLOYER}/${firstImportedEmployerIndex}`,
                nextStep: EditEmployerPageDefinition.heading,
              }
            }, [firstImportedEmployerIndex])

            const showErrorSummary =
              submitCount > 0 && Object.keys(errors).length > 0

            const hasRecentEmployers = values.recent_employers.length !== 0
            const showWarning = isRecentEmployersError
              ? recentEmployerError?.response?.status === 503
              : false

            return (
              <Form className={styles.claimForm}>
                {showErrorSummary && (
                  <FormErrorSummary key={submitCount} errors={errors} />
                )}
                {showWarning && (
                  <Alert
                    type="warning"
                    heading={t(
                      'recent_employers.employer_retrieval_warning.heading'
                    )}
                    headingLevel={'h1'}
                  >
                    {t(
                      'recent_employers.employer_retrieval_warning.header_description'
                    )}
                  </Alert>
                )}
                <SummaryBox>
                  <SummaryBoxContent>
                    {hasRecentEmployers
                      ? t('recent_employers.preamble')
                      : t('recent_employers.no_employers_on_record')}
                  </SummaryBoxContent>
                </SummaryBox>
                {hasRecentEmployers && (
                  <Fieldset
                    legend={<b>{t('recent_employers.question', { date })}</b>}
                  >
                    {values.recent_employers.map((employer, index) => {
                      return (
                        <div key={index}>
                          <YesNoQuestion
                            name={`recent_employers[${index}].worked_for_imported_employer_in_last_18mo`}
                            question={
                              <>
                                <span className="screen-reader-only">
                                  {t('recent_employers.work_at', {
                                    employer: employer.employer_name,
                                  })}
                                </span>
                                <span aria-hidden={true}>
                                  {employer.employer_name}
                                </span>
                              </>
                            }
                          />
                          {employer.worked_for_imported_employer_in_last_18mo ===
                            false && (
                            <Alert headingLevel="h3" slim={true} type="warning">
                              {t('recent_employers.confirm_employer')}
                            </Alert>
                          )}
                        </div>
                      )
                    })}
                  </Fieldset>
                )}
                <ClaimFormButtons nextStep={nextStep}>
                  <BackButton<RecentEmployerValues>
                    previousPage={previousPage.path}
                    handleSave={handleSaveRecentEmployers}
                  />
                  <NextButton nextPage={nextPageLocal} />
                </ClaimFormButtons>
                <div className="margin-top-1 text-center">
                  <SaveAndExitLink
                    disabled={isSubmitting}
                    onClick={() => handleSaveAndExit(values)}
                  />
                </div>
              </Form>
            )
          }}
        </Formik>
      </>
    )
  }
}

RecentEmployers.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default RecentEmployers
