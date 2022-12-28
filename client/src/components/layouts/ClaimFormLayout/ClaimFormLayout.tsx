import { ReactNode, useEffect, useRef, useState } from 'react'
import Error from 'next/error'
import { StepIndicator, StepIndicatorStep } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import {
  PageDefinition,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { PageHeading } from '../../form/ClaimFormHeading/PageHeading'
import PageLoader from 'components/loaders/PageLoader'

import Head from 'next/head'
import { ClaimFormSideNav } from '../../form/ClaimFormSideNav/ClaimFormSideNav'
import { ClaimantInput } from 'types/claimantInput'
import { useGetPartialClaim } from 'queries/useGetPartialClaim'
import { ClaimFormContext } from 'contexts/ClaimFormContext'

type ClaimFormProps = {
  pageDefinition: PageDefinition
  index: number
  children: ReactNode
  isDynamic?: boolean
}

export const ClaimFormLayout = ({
  children,
  pageDefinition,
  index,
}: ClaimFormProps) => {
  const { t } = useTranslation('claimForm')

  const [claimFormValues, setClaimFormValues] = useState<
    ClaimantInput | undefined
  >(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const {
    data: partialClaim,
    isLoading: isLoadingGetPartialClaim,
    isError: partialClaimIsError,
  } = useGetPartialClaim()

  // Initialize any previous partialClaim into ClaimFormContext
  useEffect(() => {
    if (!isLoadingGetPartialClaim) {
      if (partialClaim !== undefined) {
        setClaimFormValues(partialClaim)
      }
      setIsLoading(false)
    }
  }, [partialClaim, isLoadingGetPartialClaim])

  const headingRef = useRef<HTMLHeadingElement>(null)

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
    return <Error statusCode={500} />
  } else {
    return (
      <ClaimFormContext.Provider
        value={{
          claimFormValues,
          setClaimFormValues,
        }}
      >
        <Head>
          <title>{heading}</title>
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
          <ClaimFormSideNav index={index} />
          <main
            className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
            id="main-content"
          >
            <PageHeading
              ref={headingRef}
              aria-label={`${heading} ${t('step_progress', {
                step,
                totalSteps,
              })}`}
            >
              {heading}
            </PageHeading>
            {children}
          </main>
        </div>
      </ClaimFormContext.Provider>
    )
  }
}
