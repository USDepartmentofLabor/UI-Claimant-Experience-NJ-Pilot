import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { array, mixed, object, string } from 'yup'
import {
  educationLevelOptions,
  ethnicityOptions,
  raceOptions,
  sexOptions,
} from 'constants/formOptions'
import * as yup from 'yup'

export const DemographicsPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('demographics.heading'),
  path: Routes.CLAIM.DEMOGRAPHICS,
  initialValues: {
    sex: undefined,
    ethnicity: undefined,
    race: [],
    education_level: undefined,
  },
  validationSchema: object().shape({
    sex: mixed()
      .oneOf([...sexOptions])
      .required(i18n_claimForm.t('sex.errors.required')),
    race: array()
      .of(string().oneOf([...raceOptions]))
      .min(1, i18n_claimForm.t('race.errors.required')),
    ethnicity: mixed()
      .oneOf([...ethnicityOptions])
      .required(i18n_claimForm.t('ethnicity.errors.required')),
    education_level: yup
      .mixed()
      .oneOf([...educationLevelOptions])
      .required(i18n_claimForm.t('education_level.errors.required')),
  }),
}
