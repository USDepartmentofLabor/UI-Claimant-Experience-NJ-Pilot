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
import {
  FormEventHandler,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { ReviewPageDefinition } from 'constants/pages/definitions/reviewPageDefinition'
import {
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
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
import { IdentityReview } from 'components/review/sections/IdentityReview/IdentityReview'
import { HorizontalRule } from 'components/HorizonalRule/HorizontalRule'
import { EmployersReview } from 'components/review/sections/EmployersReview/EmployersReview'
import { OccupationReview } from 'components/review/sections/OccupationReview/OccupationReview'
import { PrequalReview } from 'components/review/sections/PrequalReview/PrequalReview'
import { UnionReview } from 'components/review/sections/UnionReview/UnionReview'
import { EducationAndTrainingReview } from 'components/review/sections/EducationAndTrainingReview/EducationAndTrainingReview'
import { ContactReview } from 'components/review/sections/ContactReview/ContactReview'
import { UNTOUCHED_CHECKBOX_VALUE } from 'constants/formOptions'
import { PaymentReview } from 'components/review/sections/PaymentReview/PaymentReview'
import { DisabilityReview } from 'components/review/sections/DisabilityReview/DisabilityReview'
import { DemographicsReview } from 'components/review/sections/DemographicsReview/DemographicsReview'
import { ScreenerReview } from 'components/review/sections/ScreenerReview/ScreenerReview'
import { ReviewInput } from 'types/claimantInput'
import { useGetBetaTestReview } from 'queries/useGetBetaTestReview'
import { isAxiosError } from 'axios'

const pageDefinition = ReviewPageDefinition
const previousPage = getPreviousPage(pageDefinition)

const pageInitialValues = {
  certify: UNTOUCHED_CHECKBOX_VALUE,
}
type ErrorResponse = {
  message: string
  errors: string[] | null | undefined
}

export const Review: NextPageWithLayout = () => {
  const router = useRouter()
  const { t } = useTranslation('claimForm', { keyPrefix: 'review' })
  const { t: tClaimForm } = useTranslation('claimForm')
  const { claimFormValues } = useContext(ClaimFormContext)
  const saveCompleteClaim = useSaveCompleteClaim()
  const submitClaim = useSubmitClaim()
  const { refetch } = useGetBetaTestReview()
  const [betaTestError, setBetaTestError] = useState<string | undefined>(
    undefined
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0 })
    }
  }

  const valuesRef = useRef(claimFormValues)
  valuesRef.current = claimFormValues

  const handleCompleteAndSubmit: FormEventHandler<
    HTMLButtonElement
  > = async () => {
    // Make sure we're using the updated context value now that the formik form has been saved
    const completeClaimValues = valuesRef.current
    if (completeClaimValues !== undefined) {
      setIsSubmitting(true)
      saveCompleteClaim.mutate(completeClaimValues, {
        onSuccess: async () => {
          // Send HTML review artifact of review page to backend server
          const betaTestReviewResult = await refetch()
          if (betaTestReviewResult.data?.status === 200) {
            submitClaim.mutate(completeClaimValues, {
              onSuccess: async () => {
                await router.push({
                  pathname: Routes.CLAIM.SUCCESS,
                })
              },
              onError: () => {
                scrollToTop()
                setIsSubmitting(false)
              },
            })
          } else {
            const { error } = betaTestReviewResult
            if (error && isAxiosError(error))
              setBetaTestError(error.response?.data || error.message)
            scrollToTop()
            setIsSubmitting(false)
          }
        },
        onError: () => {
          scrollToTop()
          setIsSubmitting(false)
        },
      })
    }
  }

  const displayCompleteClaimErrors = (data: any) => {
    const response = data as ErrorResponse

    if (!response?.errors) {
      return <li key={'error_data'}>{response.message}</li>
    }

    const regex = /[$.]/g
    return response.errors.map((element) => (
      <li key={element}>{element.replaceAll(regex, '')}</li>
    ))
  }

  return (
    <ClaimFormik<ReviewInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {() => {
        return (
          <>
            {(saveCompleteClaim.isError ||
              submitClaim.isError ||
              betaTestError) && (
              <Alert
                type="error"
                headingLevel="h2"
                className="margin-top-1"
                heading={tClaimForm('complete_claim_error')}
                validation
              >
                <ul className="usa-list">
                  {saveCompleteClaim.isError &&
                    saveCompleteClaim.error.response?.data && (
                      <div data-testid={'error-list'}>
                        {displayCompleteClaimErrors(
                          saveCompleteClaim.error.response.data
                        )}
                      </div>
                    )}

                  {submitClaim.isError && submitClaim.error.response && (
                    <li>
                      {typeof submitClaim.error.response.data === 'object'
                        ? JSON.stringify(submitClaim.error.response.data)
                        : submitClaim.error.response.data}
                    </li>
                  )}
                  {betaTestError && <li>{betaTestError}</li>}
                </ul>
              </Alert>
            )}
            <SummaryBox>
              <SummaryBoxHeading headingLevel="h2">
                {t('preamble.heading')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <ul className="usa-list">
                  <li>{t('preamble.line1')}</li>
                  <li>{t('preamble.line2')}</li>
                  <li>{t('preamble.line3')}</li>
                </ul>
              </SummaryBoxContent>
            </SummaryBox>

            <ScreenerReview />
            <HorizontalRule />

            <PrequalReview />
            <HorizontalRule />

            <IdentityReview />
            <HorizontalRule />

            <PersonalReview />
            <HorizontalRule />

            <ContactReview />
            <HorizontalRule />

            <DemographicsReview />
            <HorizontalRule />

            <EmployersReview />
            <HorizontalRule />

            <OccupationReview />
            <HorizontalRule />

            <EducationAndTrainingReview />
            <HorizontalRule />

            <UnionReview />
            <HorizontalRule />

            <DisabilityReview />
            <HorizontalRule />

            <PaymentReview />
            <HorizontalRule />

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
              <BackButton
                previousPage={previousPage.path}
                disabled={isSubmitting}
              />
              <SubmitButton
                onSubmit={handleCompleteAndSubmit}
                disabled={isSubmitting}
              />
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
