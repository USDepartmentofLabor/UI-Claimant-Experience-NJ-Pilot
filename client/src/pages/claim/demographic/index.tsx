import { NextPage } from 'next'
import { Formik } from 'formik'
import { Alert, Fieldset } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

import {
  ethnicityOptions,
  sexOptions,
  raceOptions,
} from 'constants/formOptions'
import { noop } from 'helpers/noop/noop'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { CheckboxGroupField } from 'components/form/fields/CheckboxGroupField/CheckboxGroupField'

import formStyles from 'components/form/form.module.scss'

// TODO: add pageSchema for yup validations

const Demographic: NextPage = () => {
  const { t } = useTranslation('claimForm')
  // const { values, setFieldValue } = useFormikContext<ClaimantInput>() todo: uncomment when formik page wrapper is in place
  return (
    // temporarily wrap in Formik until we have the page wrapper build
    <Formik initialValues={{}} values setFieldValue onSubmit={noop}>
      <>
        <Alert type="info" headingLevel="h4">
          {t('demographic_information.info_alert')}
        </Alert>
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
              // checkboxProps: {
              //   onChange: (e) => {
              //     if (e.target.value === 'opt_out' && e.target.checked) {
              //       setFieldValue('race', ['opt_out'], true)
              //     }
              //   },
              //   disabled:
              //     values.race?.includes('opt_out') && raceOption !== 'opt_out',
              // },
            }))}
          />
        </Fieldset>
      </>
    </Formik>
  )
}

export default Demographic

// TODO: add PageDefinition
