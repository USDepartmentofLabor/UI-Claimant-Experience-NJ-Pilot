import { useTranslation } from 'react-i18next'
import { Trans } from 'next-i18next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { Link } from '@trussworks/react-uswds'
import { ReactNode } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { NextPageWithLayout } from 'pages/_app'
import { EducationAndTrainingPageDefinition } from 'constants/pages/definitions/educationAndTrainingPageDefinition'
import { ChangeEventHandler } from 'react'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import { EducationAndTrainingInput } from 'types/claimantInput'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'

const pageDefinition = EducationAndTrainingPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const EducationAndTraining: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')

  return (
    <ClaimFormik<EducationAndTrainingInput>
      initialValues={pageDefinition.initialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values, clearField }) => {
        const handleAttendingCollegeOrTrainingChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'no') {
            await clearField('training_through_hiring_hall_or_career_center')
          }
        }

        return (
          <>
            <YesNoQuestion
              question={t('education_and_training.attending_training.label')}
              name="attending_college_or_job_training"
              onChange={handleAttendingCollegeOrTrainingChange}
              hint={t('education_and_training.attending_training.help_text')}
            />
            {values.attending_college_or_job_training && (
              <YesNoQuestion
                question={t(
                  'education_and_training.training_through_hiring_hall_or_career_center.label'
                )}
                name="training_through_hiring_hall_or_career_center"
                hint={
                  <Trans
                    t={t}
                    i18nKey="education_and_training.training_through_hiring_hall_or_career_center.help_text"
                  >
                    <Link
                      variant="external"
                      href={'https://www.nj.gov/labor/career-services/'}
                    >
                      New Jersey career services
                    </Link>
                  </Trans>
                }
              />
            )}
            <ClaimFormButtons nextStep={nextPage.heading}>
              <BackButton previousPage={previousPage.path} />
              <NextButton nextPage={nextPage.path} />
            </ClaimFormButtons>
          </>
        )
      }}
    </ClaimFormik>
  )
}

EducationAndTraining.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default EducationAndTraining
