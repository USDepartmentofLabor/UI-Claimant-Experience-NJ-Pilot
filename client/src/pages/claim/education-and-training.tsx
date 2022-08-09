import { Fieldset } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'
import * as yup from 'yup'
import { NextPage } from 'next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { useClearFields } from 'hooks/useClearFields'
import { useShowErrors } from 'hooks/useShowErrors'
import { Routes } from 'constants/routes'
import { enrollmentOptions } from 'constants/formOptions'
import { i18n_claimForm } from 'i18n/i18n'
import { ClaimantInput } from 'types/claimantInput'

const EducationAndTraining: NextPage = () => {
  const { t } = useTranslation('claimForm')
  const { values } = useFormikContext<ClaimantInput>()
  const showTrainingTypeError = useShowErrors('type_of_college_or_job_training')
  const { clearField } = useClearFields()

  const handleAttendingCollegeOrTraining = () => {
    if (!values.attending_college_or_job_training) {
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
        <Fieldset
          legend={t('education_and_training.enrollment.label')}
          className={
            showTrainingTypeError
              ? 'dol-fieldset usa-form-group--error'
              : 'dol-fieldset'
          }
        >
          <RadioField
            name="enrollment"
            options={enrollmentOptions.map((option) => ({
              value: option,
              label: t(`education_and_training.enrollment.options.${option}`),
            }))}
          />
        </Fieldset>
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
  enrollment: yup.string().when('attending_college_or_job_training', {
    is: true,
    then: yup
      .string()
      .oneOf([...enrollmentOptions])
      .required(t('education_and_training.enrollment.error.required')),
  }),
})

export const EducationAndTrainingPageDefinition: PageDefinition = {
  path: Routes.CLAIM.EDUCATION_VOCATIONAL_REHAB,
  heading: t('education_and_training.heading'),
  initialValues: {},
  validationSchema: pageSchema,
}
