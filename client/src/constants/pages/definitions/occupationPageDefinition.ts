import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { object, string } from 'yup'

export const OccupationPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('occupation.heading'),
  path: Routes.CLAIM.OCCUPATION,
  validationSchema: object().shape({
    job_title: string().required(
      i18n_claimForm.t('occupation.job_title.errors.required')
    ),
    job_description: string()
      .max(255, i18n_claimForm.t('occupation.job_description.errors.maxLength'))
      .required(i18n_claimForm.t('occupation.job_description.errors.required')),
  }),
}
