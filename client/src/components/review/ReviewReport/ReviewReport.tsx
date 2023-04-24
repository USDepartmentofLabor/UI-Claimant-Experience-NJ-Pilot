import {
  ClaimFormContext,
  ClaimFormContextType,
} from 'contexts/ClaimFormContext'
import { ContactReview } from '../sections/ContactReview/ContactReview'
import { EducationAndTrainingReview } from '../sections/EducationAndTrainingReview/EducationAndTrainingReview'
import { IdentityReview } from '../sections/IdentityReview/IdentityReview'
import { PersonalReview } from '../sections/PersonalReview/PersonalReview'
import { PrequalReview } from '../sections/PrequalReview/PrequalReview'
import { UnionReview } from '../sections/UnionReview/UnionReview'
import { ReactNode } from 'react'
import { ScreenerReview } from '../sections/ScreenerReview/ScreenerReview'
import { DemographicsReview } from '../sections/DemographicsReview/DemographicsReview'
import { EmployersReview } from '../sections/EmployersReview/EmployersReview'
import { OccupationReview } from '../sections/OccupationReview/OccupationReview'
import { DisabilityReview } from '../sections/DisabilityReview/DisabilityReview'
import { PaymentReview } from '../sections/PaymentReview/PaymentReview'
import { useTranslation } from 'next-i18next'
import { ReviewElement } from '../ReviewElement/ReviewElement'

export const ReviewReportSections = (reviewValues: ClaimFormContextType) => {
  const { t } = useTranslation('claimForm')
  // This is a staff-facing value, so isn't in the Claimant-facing Review components
  const occucoder_code = reviewValues.claimFormValues?.occucoder_code

  return (
    <>
      <h1>{t('review.heading')}</h1>
      <ClaimFormContext.Provider value={reviewValues}>
        <ScreenerReview />
        <PrequalReview />
        <IdentityReview />
        <PersonalReview />
        <ContactReview />
        <DemographicsReview />
        <EmployersReview />
        <OccupationReview />
        {occucoder_code && (
          // Staff-facing content doesn't need translated
          <ReviewElement label="Occupation code" value={occucoder_code} />
        )}

        <EducationAndTrainingReview />
        <UnionReview />
        <DisabilityReview />
        <PaymentReview />
      </ClaimFormContext.Provider>
    </>
  )
}

type DocumentProps = {
  children: ReactNode
}

const Document = ({ children }: DocumentProps) => (
  <html lang="en">
    <meta charSet="UTF-8" />
    <title>Review</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <body>{children}</body>
  </html>
)

/**
 * This is the markup that gets saved to S3 as an HTML file, which is the
 * primary artifact that NJ staff are using during beta testing for manually
 * inputting data into the claims system.
 */
export const ReviewReport = (reviewValues: ClaimFormContextType) => {
  return (
    <Document>
      <ReviewReportSections {...reviewValues} />
    </Document>
  )
}
