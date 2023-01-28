import { useTranslation, Trans } from 'react-i18next'
import { NextPageWithLayout } from 'pages/_app'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { OccupationInput } from 'types/claimantInput'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import TextField from 'components/form/fields/TextField/TextField'
import TextAreaField from 'components/form/fields/TextAreaField/TextAreaField'
import { Link, SummaryBox, SummaryBoxContent } from '@trussworks/react-uswds'

import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { OccupationPageDefinition } from 'constants/pages/definitions/occupationPageDefinition'

import { ReactNode } from 'react'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'

const pageDefinition = OccupationPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const Occupation: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'occupation',
  })

  return (
    <ClaimFormik<OccupationInput>
      initialValues={pageDefinition.initialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      <SummaryBox>
        <SummaryBoxContent>
          <Trans t={t} i18nKey="choose_the_occupation">
            <Link variant="external" href={t('reemployment_profile_link')}>
              {''}
            </Link>
          </Trans>
        </SummaryBoxContent>
      </SummaryBox>
      <TextField label={t('job_title.label')} type="text" name="job_title" />
      <TextAreaField
        label={t('job_description.label')}
        name="job_description"
        characterLimit={255}
      />
      <ClaimFormButtons nextStep={nextPage.heading}>
        <BackButton previousPage={previousPage.path} />
        <NextButton nextPage={nextPage.path} />
      </ClaimFormButtons>
    </ClaimFormik>
  )
}

Occupation.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Occupation
