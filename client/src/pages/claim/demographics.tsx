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
  RaceOption,
  educationLevelOptions,
} from 'constants/formOptions'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { CheckboxGroupField } from 'components/form/fields/CheckboxGroupField/CheckboxGroupField'

import formStyles from 'components/form/form.module.scss'
import { ClaimantInput } from 'types/claimantInput'
import { useFormikContext } from 'formik'
import { NextPage } from 'next'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { array, mixed, object } from 'yup'
import DropdownField from '../../components/form/fields/DropdownField/DropdownField'
import * as yup from 'yup'

const Demographics: NextPage = () => {
  const { t } = useTranslation('claimForm')
  const { values, setFieldValue } = useFormikContext<ClaimantInput>()
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
        <CheckboxGroupField
          name="race"
          options={raceOptions.map((raceOption) => ({
            label: t(`race.options.${raceOption}`),
            value: raceOption,
            checkboxProps: {
              onChange: (e) => {
                if (e.target.value === 'opt_out' && e.target.checked) {
                  setFieldValue('race', ['opt_out'], true)
                }
              },
              disabled:
                values.race?.includes('opt_out') && raceOption !== 'opt_out',
            },
          }))}
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
  },
  validationSchema: object().shape({
    sex: mixed()
      .oneOf([...sexOptions])
      .required(i18n_claimForm.t('sex.errors.required')),
    race: array()
      .of(mixed().oneOf([...raceOptions]))
      .when({
        is: (raceValue: RaceOption[] | undefined) =>
          raceValue?.includes('opt_out'),
        then: array().max(1, i18n_claimForm.t('race.errors.opt_out_only')),
        otherwise: array().min(1, i18n_claimForm.t('race.errors.required')),
      })
      .required(i18n_claimForm.t('race.errors.required')),
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
