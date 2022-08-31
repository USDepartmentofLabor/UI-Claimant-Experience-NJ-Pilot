import {
  Fieldset,
  SummaryBox,
  SummaryBoxContent,
} from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

import {
  ethnicityOptions,
  sexOptions,
  raceOptions,
  educationLevelOptions,
} from 'constants/formOptions'
import { RadioField } from 'components/form/fields/RadioField/RadioField'

import formStyles from 'components/form/form.module.scss'
import { NextPage } from 'next'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { array, mixed, object, string } from 'yup'
import DropdownField from '../../components/form/fields/DropdownField/DropdownField'
import * as yup from 'yup'
import { useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'

const Demographics: NextPage = () => {
  const { t } = useTranslation('claimForm')
  const { errors } = useFormikContext<ClaimantInput>()

  return (
    <>
      <SummaryBox>
        <SummaryBoxContent>{t('demographics.preamble')}</SummaryBoxContent>
      </SummaryBox>
      <Fieldset legend={t('sex.label')} className={formStyles.field}>
        <RadioField
          name="sex"
          options={sexOptions.map((option) => {
            return {
              label: t(`sex.options.${option}`),
              value: option,
            }
          })}
        />
      </Fieldset>
      <Fieldset legend={t('ethnicity.label')} className={formStyles.field}>
        <RadioField
          name="ethnicity"
          options={ethnicityOptions.map((option) => {
            return {
              label: t(`ethnicity.options.${option}`),
              value: option,
            }
          })}
        />
      </Fieldset>
      <Fieldset legend={t('race.label')} className={formStyles.field}>
        <RadioField
          name="race[0]"
          options={raceOptions.map((option) => {
            return {
              label: t(`race.options.${option}`),
              value: option,
            }
          })}
          errorMessage={errors.race}
        />
      </Fieldset>
      <DropdownField
        name="education_level"
        label={t('education_level.label')}
        startEmpty
        options={educationLevelOptions.map((option) => ({
          value: option,
          label: t(`education_level.options.${option}`),
        }))}
      />
    </>
  )
}

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

export default Demographics
