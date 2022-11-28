import { useTranslation } from 'react-i18next'
import { Trans } from 'next-i18next'
import { useFormikContext } from 'formik'
import * as yup from 'yup'
import { NextPage } from 'next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { useClearFields } from 'hooks/useClearFields'
import { Routes } from 'constants/routes'
import { i18n_claimForm } from 'i18n/i18n'
import { ClaimantInput } from 'types/claimantInput'
import { Link } from '@trussworks/react-uswds'
import { ChangeEventHandler } from 'react'

const EducationAndTraining: NextPage = () => {
  const { t } = useTranslation('claimForm')
  const { values } = useFormikContext<ClaimantInput>()
  const { clearField } = useClearFields()

  const handleAttendingCollegeOrTraining: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value !== 'yes') {
      clearField('enrollment')
    }
  }

  return (
    <>
      <YesNoQuestion
        question={t('education_and_training.attending_training.label')}
        name="attending_college_or_job_training"
        onChange={handleAttendingCollegeOrTraining}
        hint={t('education_and_training.attending_training.help_text')}
      />
      {values.attending_college_or_job_training && (
        <YesNoQuestion
          question={t('education_and_training.enrollment.label')}
          name="enrollment"
          hint={
            <Trans t={t} i18nKey="education_and_training.enrollment.help_text">
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
    </>
  )
}

export default EducationAndTraining

const { t } = i18n_claimForm
const pageSchema = yup.object().shape({
  attending_college_or_job_training: yup
    .boolean()
    .required(t('education_and_training.attending_training.required')),
  enrollment: yup.boolean().when('attending_college_or_job_training', {
    is: true,
    then: yup
      .boolean()
      .required(t('education_and_training.enrollment.error.required')),
  }),
})

export const EducationAndTrainingPageDefinition: PageDefinition = {
  path: Routes.CLAIM.EDUCATION_VOCATIONAL_REHAB,
  heading: t('education_and_training.heading'),
  initialValues: {},
  validationSchema: pageSchema,
}
