import { NextPage } from 'next'

import { useTranslation } from 'react-i18next'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { boolean, object } from 'yup'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import {
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
} from '@trussworks/react-uswds'
import CheckboxField from 'components/form/fields/CheckboxField/CheckboxField'
import { Trans } from 'next-i18next'

export const Review: NextPage = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'review' })

  return (
    <>
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
    </>
  )
}

export const ReviewPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('review.heading'),
  path: Routes.CLAIM.REVIEW,
  initialValues: {
    certify: undefined,
  },
  validationSchema: object().shape({
    certify: boolean()
      .isTrue(i18n_claimForm.t('review.certify.errors.mustBeTrue'))
      .required(i18n_claimForm.t('review.certify.errors.required')),
  }),
}

export default Review
