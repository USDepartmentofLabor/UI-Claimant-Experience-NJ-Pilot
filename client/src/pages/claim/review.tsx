import { useTranslation } from 'react-i18next'
import {
  Alert,
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
} from '@trussworks/react-uswds'
import CheckboxField from 'components/form/fields/CheckboxField/CheckboxField'
import { Trans } from 'next-i18next'
import { NextPageWithLayout } from 'pages/_app'
import { FormEventHandler, ReactNode, useContext, useRef } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { ReviewPageDefinition } from 'constants/pages/definitions/reviewPageDefinition'
import {
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { ReviewInput } from 'types/claimantInput'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { SubmitButton } from 'components/form/ClaimFormButtons/SubmitButton/SubmitButton'
import { useSaveCompleteClaim } from 'queries/useSaveCompleteClaim'
import { useSubmitClaim } from 'queries/useSubmitClaim'
import { Routes } from 'constants/routes'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { useRouter } from 'next/router'
import { PersonalReview } from 'components/review/sections/PersonalReview/PersonalReview'
import { HorizontalRule } from 'components/HorizonalRule/HorizontalRule'
import { EmployersReview } from 'components/review/sections/EmployerReview/EmployerReview'

const pageDefinition = ReviewPageDefinition
const previousPage = getPreviousPage(pageDefinition)

export const Review: NextPageWithLayout = () => {
  const router = useRouter()
  const { t } = useTranslation('claimForm', { keyPrefix: 'review' })
  const { t: tClaimForm } = useTranslation('claimForm')
  const { claimFormValues } = useContext(ClaimFormContext)
  const saveCompleteClaim = useSaveCompleteClaim()
  const submitClaim = useSubmitClaim()

  const valuesRef = useRef(claimFormValues)
  valuesRef.current = claimFormValues

  const handleCompleteAndSubmit: FormEventHandler<HTMLButtonElement> = () => {
    // Make sure we're using the updated context value now that the formik form has been saved
    const completeClaimValues = valuesRef.current
    if (completeClaimValues !== undefined) {
      saveCompleteClaim.mutate(completeClaimValues, {
        onSuccess: async () => {
          await submitClaim.mutate(completeClaimValues, {
            onSuccess: async () =>
              await router.push({
                pathname: Routes.HOME,
                query: { completed: true },
              }),
          })
        },
      })
    }
  }

  return (
    <ClaimFormik<ReviewInput>
      initialValues={pageDefinition.initialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {() => {
        return (
          <>
            {(saveCompleteClaim.isError || submitClaim.isError) && (
              <Alert
                type="error"
                headingLevel="h4"
                className="margin-top-1"
                validation
              >
                <div>{tClaimForm('complete_claim_error')}</div>
                <ul>
                  {saveCompleteClaim.isError &&
                    saveCompleteClaim.error.response && (
                      <li>
                        {typeof saveCompleteClaim.error.response.data ===
                        'object'
                          ? JSON.stringify(
                              saveCompleteClaim.error.response.data
                            )
                          : saveCompleteClaim.error.response.data}
                      </li>
                    )}
                  {submitClaim.isError && submitClaim.error.response && (
                    <li>
                      {typeof submitClaim.error.response.data === 'object'
                        ? JSON.stringify(submitClaim.error.response.data)
                        : submitClaim.error.response.data}
                    </li>
                  )}
                </ul>
              </Alert>
            )}
            <SummaryBox>
              <SummaryBoxHeading headingLevel="h2">
                {t('preamble.heading')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <ul>
                  <li>{t('preamble.line1')}</li>
                  <li>{t('preamble.line2')}</li>
                  <li>{t('preamble.line3')}</li>
                </ul>
              </SummaryBoxContent>
            </SummaryBox>

            <PersonalReview />
            <HorizontalRule />
            <EmployersReview />
            <CheckboxField
              name="certify"
              formGroupClassName="padding-top-05"
              label={
                <Trans t={t} i18nKey="certify.label">
                  <Link
                    variant="external"
                    href="https://nj.gov/labor/myunemployment/labor/myunemployment/before/fraud/"
                  >
                    false and misleading information
                  </Link>
                </Trans>
              }
            />
            <ClaimFormButtons>
              <BackButton previousPage={previousPage.path} />
              <SubmitButton onSubmit={handleCompleteAndSubmit} />
            </ClaimFormButtons>
          </>
        )
      }}
    </ClaimFormik>
  )
}

Review.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Review
