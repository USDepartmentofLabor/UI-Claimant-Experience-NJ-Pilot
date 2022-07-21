import { NextPage } from 'next'
import { boolean, date, mixed, object, ref } from 'yup'
import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { DatePicker } from 'components/form/fields/DatePicker/DatePicker'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { formatUserInputDate } from 'utils/date/format'
import HelpText from 'components/HelpText/HelpText'
import { disabilityTypeOptions } from 'constants/formOptions'
import { ClaimantInput } from 'types/claimantInput'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'

export const Disability: NextPage = () => {
  const { values, setFieldValue } = useFormikContext<ClaimantInput>()
  const { t } = useTranslation('claimForm')

  useEffect(() => {
    if (
      !values.disability?.recovery_date &&
      values.disability?.contacted_last_employer_after_recovery !== undefined
    ) {
      setFieldValue(
        'disability.contacted_last_employer_after_recovery',
        undefined
      )
    }
    if (values.disability?.has_collected_disability !== false) {
      return
    }
    Object.keys(values.disability).forEach((key) => {
      const k = key as keyof typeof values.disability
      if (
        k !== 'has_collected_disability' &&
        values.disability?.[`${k}`] !== undefined
      ) {
        setFieldValue(`disability.${k}`, undefined)
      }
    })
  }, [values])

  return (
    <>
      <YesNoQuestion
        question={t('disability.has_collected_disability.label')}
        name="disability.has_collected_disability"
      >
        <HelpText withLeftBorder={true}>
          {t('disability.has_collected_disability.help_text')}
        </HelpText>
      </YesNoQuestion>
      {values.disability?.has_collected_disability && (
        <>
          <YesNoQuestion
            question={t('disability.disabled_immediately_before.label')}
            name="disability.disabled_immediately_before"
          />
          <DropdownField
            name="disability.type_of_disability"
            label={t('disability.type_of_disability.label')}
            options={disabilityTypeOptions.map((option) => {
              return {
                label: t(`disability.type_of_disability.options.${option}`),
                value: option,
              }
            })}
            startEmpty
          />
          <DatePicker
            name="disability.date_disability_began"
            label={t('disability.date_disability_began.label')}
            defaultValue={values.disability.date_disability_began}
            maxDate={
              values.disability.recovery_date ||
              formatUserInputDate(new Date().toISOString())
            }
            onChange={(val: string | undefined) => {
              setFieldValue(
                'disability.date_disability_began',
                formatUserInputDate(val),
                true
              )
            }}
          />
          <DatePicker
            name="disability.recovery_date"
            label={t('disability.recovery_date.label')}
            defaultValue={values.disability.recovery_date}
            minDate={values.disability.date_disability_began || undefined}
            maxDate={new Date().toISOString().split('T')[0]}
            onChange={(val: string | undefined) => {
              setFieldValue(
                'disability.recovery_date',
                formatUserInputDate(val),
                true
              )
            }}
          />
          {values.disability.recovery_date && (
            <YesNoQuestion
              question={t('disability.contact_employer_after_recovering.label')}
              name="disability.contacted_last_employer_after_recovery"
            />
          )}
        </>
      )}
    </>
  )
}

const validationSchema = object().shape({
  disability: object().shape({
    has_collected_disability: boolean().required(
      i18n_claimForm.t('disability.has_collected_disability.errors.required')
    ),
    disabled_immediately_before: boolean().when('has_collected_disability', {
      is: true,
      then: boolean().required(),
    }),
    date_disability_began: date()
      .max(new Date())
      .when('has_collected_disability', {
        is: true,
        then: date().required(),
      }),
    recovery_date: date()
      .max(new Date())
      .when('date_disability_began', {
        is: (dateValue: string | undefined) => !!dateValue,
        then: date().min(ref('date_disability_began')),
      }),
    type_of_disability: mixed()
      .oneOf([...disabilityTypeOptions])
      .when('has_collected_disability', {
        is: true,
        then: mixed().required(),
      }),
    contacted_last_employer_after_recovery: boolean().when('recovery_date', {
      is: (val: string | undefined) => !!val,
      then: boolean().required(),
    }),
  }),
})

export const DisabilityPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('disability.heading'),
  path: Routes.CLAIM.DISABILITY,
  initialValues: { disability: {} },
  validationSchema,
}

export default Disability
