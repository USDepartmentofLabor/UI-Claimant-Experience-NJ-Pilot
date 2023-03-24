import { ReactNode, useContext, useEffect, useState } from 'react'
import Error from 'next/error'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { StepIndicator, StepIndicatorStep } from '@trussworks/react-uswds'

import { Routes } from 'constants/routes'
import {
  PageDefinition,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import PageLoader from 'components/loaders/PageLoader'
import { ClaimFormSideNav } from 'components/form/ClaimFormSideNav/ClaimFormSideNav'
import { useGetPartialClaim } from 'queries/useGetPartialClaim'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { useClaimProgress } from 'hooks/useClaimProgress'
// import { IntakeAppContext } from 'contexts/IntakeAppContext'
// import { useInitialScreenerValues } from 'pages/screener'
// import { pageInitialValues } from 'pages/screener'
// import { ScreenerInput } from 'types/claimantInput'
// import { merge } from 'lodash'

type ClaimFormProps = {
  pageDefinition: PageDefinition
  index: number
  children: ReactNode
  isDynamic?: boolean
}
// //MESSY JUST TESTING IF THIS CHANGES ANY FUNCTIONALITY
// const useInitialScreenerValues = (screenerInput: ScreenerInput | undefined) => {
//   const initialValues = pageInitialValues as ScreenerInput

//   merge(initialValues, screenerInput)
//   return {
//     initialValues,
//   }
// }
export const ClaimFormLayout = ({
  children,
  pageDefinition,
  index,
}: ClaimFormProps) => {
  const { setClaimFormValues } = useContext(ClaimFormContext)
  // const { setSsn, setScreenerInput, screenerInput } = useContext(IntakeAppContext)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const {
    data: partialClaim,
    isLoading: isLoadingGetPartialClaim,
    isError: partialClaimIsError,
    isSuccess: partialClaimIsSuccess,
    isIdle: partialClaimIsIdle,
  } = useGetPartialClaim()
  const { continuePath } = useClaimProgress()

  const { t: tCommon } = useTranslation('common')
  const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'development'

  // Initialize any previous partialClaim into ClaimFormContext
  useEffect(() => {
    // The query starts off idle before it starts loading.
    // Wait for success or error, specifically
    if (partialClaimIsSuccess && partialClaim !== undefined) {
      setClaimFormValues(partialClaim)
      // if (partialClaim?.ssn){
      // setSsn({ssn:partialClaim.ssn})
      // }
      // const {initialValues: screenerValues}= useInitialScreenerValues(screenerInput)
      // setScreenerInput(screenerValues)
      // const {
      //   screener_current_country_us,
      //   screener_live_in_canada,
      //   screener_job_last_eighteen_months,
      //   screener_work_nj,
      //   screener_military_service_eighteen_months,
      //   screener_currently_disabled,
      //   screener_federal_work_in_last_eighteen_months,
      //   screener_maritime_employer_eighteen_months,
      // }=partialClaim
      //   setScreenerInput(
      //     {
      //       screener_current_country_us:screener_current_country_us,
      //       screener_live_in_canada:screener_live_in_canada,
      //       screener_job_last_eighteen_months:screener_job_last_eighteen_months,
      //       screener_work_nj:screener_work_nj,
      //       screener_military_service_eighteen_months:screener_military_service_eighteen_months,
      //       screener_currently_disabled: screener_currently_disabled,
      //       screener_currently_disabled:screener_federal_work_in_last_eighteen_months,
      //       screener_currently_disabled:screener_maritime_employer_eighteen_months,
      //     }
      // }
    }
    if (!partialClaimIsIdle && !isLoadingGetPartialClaim) {
      setIsLoading(false)
    }
  }, [partialClaim, isLoadingGetPartialClaim])

  useEffect(() => {
    if (!isDev) {
      if (partialClaim !== undefined) {
        const screenerPageNotSaved =
          partialClaim.screener_current_country_us === undefined
        if (!partialClaim.ssn || screenerPageNotSaved) {
          void router.push(Routes.SSN)
        } else if (!isLoading && continuePath !== Routes.HOME) {
          const continuePageIndex = pageDefinitions.findIndex(
            (page) => page.path === continuePath
          )
          const currentPageIndex = pageDefinitions.findIndex(
            (page) => pageDefinition.path === page.path
          )
          if (continuePageIndex < currentPageIndex) {
            void router.push(pageDefinitions[`${continuePageIndex}`].path)
          }
        }
      }
    }
  }, [isLoading, continuePath])

  const { heading } = pageDefinition // TODO: Pass in heading and index to avoid dependency on pageDefinition?
  const currentPageIndex = index

  const step = currentPageIndex + 1
  const totalSteps = pageDefinitions.length

  const getStatus = (index: number) => {
    if (index === currentPageIndex) return 'current'
    if (index < currentPageIndex) return 'complete'
    return undefined
  }

  if (isLoading) {
    return <PageLoader />
  } else if (partialClaimIsError) {
    return <Error title={tCommon('errorStatus.500')} statusCode={500} />
  } else {
    return (
      <>
        <Head>
          <title>{heading}</title>
        </Head>
        <div className="grid-row grid-gap">
          <StepIndicator
            className="overflow-hidden width-tablet margin-x-auto"
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
          <ClaimFormSideNav index={index} />
          <main
            className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
            id="main-content"
          >
            {children}
          </main>
        </div>
      </>
    )
  }
}
