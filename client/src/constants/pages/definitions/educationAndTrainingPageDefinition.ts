import { i18n_claimForm } from 'i18n/i18n'
import * as yup from 'yup'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'

const { t } = i18n_claimForm
const validationSchema = yup.object().shape({
  attending_college_or_job_training: yup
    .boolean()
    .nullable()
    .required(t('education_and_training.attending_training.required')),
  training_through_hiring_hall_or_career_center: yup
    .boolean()
    .nullable()
    .when('attending_college_or_job_training', {
      is: true,
      then: (schema) =>
        schema.required(
          t(
            'education_and_training.training_through_hiring_hall_or_career_center.error.required'
          )
        ),
    }),
})

export const EducationAndTrainingPageDefinition: PageDefinition = {
  path: Routes.CLAIM.EDUCATION_VOCATIONAL_REHAB,
  heading: t('education_and_training.heading'),
  validationSchema,
}
