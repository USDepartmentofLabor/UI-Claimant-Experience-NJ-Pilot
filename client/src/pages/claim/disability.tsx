import { NextPage } from 'next'
import { array, boolean, string, object, ref, mixed } from 'yup'
import { useFormikContext } from 'formik'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
} from '@trussworks/react-uswds'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { CheckboxGroupField } from 'components/form/fields/CheckboxGroupField/CheckboxGroupField'
import {
  disabilityTypeOptions,
  disabilityPaymentTypeOptions,
  DisabilityPaymentTypeOption,
} from 'constants/formOptions'
import { ClaimantInput } from 'types/claimantInput'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import { yupDate } from 'validations/yup/custom'
import { useClearFields } from 'hooks/useClearFields'
import formStyles from 'components/form/form.module.scss'

export const Disability: NextPage = () => {
  const { values, setFieldValue } = useFormikContext<ClaimantInput>()
  const { t } = useTranslation('claimForm')
  const { clearFields } = useClearFields()

  const hasCollectedDisability =
    values.disability_applied_to_or_received?.includes('disability') ||
    values.disability_applied_to_or_received?.includes('family_leave')
  const handleHasCollectedDisabilityChange = () => {
    if (!hasCollectedDisability) {
      clearFields([
        'disabled_immediately_before',
        'type_of_disability',
        'date_disability_began',
        'recovery_date',
        'contacted_last_employer_after_recovery',
      ])
    }
  }
  return (
    <>
      <SummaryBox>
        <SummaryBoxHeading headingLevel="h2">
          {t('disability.info_alert.title')}
        </SummaryBoxHeading>
        <SummaryBoxContent>
          <ul>
            <li>{t('disability.info_alert.items.doctor_cert')}</li>
            <li>{t('disability.info_alert.items.tdi')}</li>
            <li>{t('disability.info_alert.items.workers_comp')}</li>
          </ul>
        </SummaryBoxContent>
      </SummaryBox>
      <CheckboxGroupField
        legend={t('disability.disability_applied_to_or_received.label')}
        name="disability_applied_to_or_received"
        options={disabilityPaymentTypeOptions.map((paymentOption) => ({
          label: t(
            `disability.disability_applied_to_or_received.options.${paymentOption}`
          ),
          value: paymentOption,
          checkboxProps: {
            onChange: (e) => {
              if (e.target.value === 'none' && e.target.checked) {
                setFieldValue(
                  'disability_applied_to_or_received',
                  ['none'],
                  true
                )
              }
              handleHasCollectedDisabilityChange()
            },
            disabled:
              values.disability_applied_to_or_received?.includes('none') &&
              paymentOption !== 'none',
          },
        }))}
      />
      {hasCollectedDisability && (
        <>
          <YesNoQuestion
            question={t('disability.disabled_immediately_before.label')}
            name="disabled_immediately_before"
          />
          <RadioField
            name="type_of_disability"
            legend={t('disability.type_of_disability.label')}
            showsErrors={true}
            fieldsetClassName={formStyles.field}
            options={disabilityTypeOptions.map((option) => {
              return {
                label: t(`disability.type_of_disability.options.${option}`),
                value: option,
              }
            })}
          />
          <DateInputField
            name="date_disability_began"
            legend={t('disability.date_disability_began.label')}
          />
          <DateInputField
            name="recovery_date"
            legend={t('disability.recovery_date.label')}
            hint={t('disability.recovery_date.help_text')}
          />
          <YesNoQuestion
            question={t(
              'disability.contacted_last_employer_after_recovery.label'
            )}
            name="contacted_last_employer_after_recovery"
          />
        </>
      )}
    </>
  )
}

const validationSchema = object().shape({
  disability_applied_to_or_received: array()
    .of(mixed().oneOf([...disabilityPaymentTypeOptions]))
    .when({
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('none'),
      then: array().max(
        1,
        i18n_claimForm.t(
          'disability.disability_applied_to_or_received.errors.none_only'
        )
      ),
      otherwise: array().min(
        1,
        i18n_claimForm.t(
          'disability.disability_applied_to_or_received.errors.required'
        )
      ),
    })
    .required(
      i18n_claimForm.t(
        'disability.disability_applied_to_or_received.errors.required'
      )
    ),
  disabled_immediately_before: boolean().when(
    'disability_applied_to_or_received',
    {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'disability.disabled_immediately_before.errors.required'
          )
        ),
    }
  ),
  type_of_disability: string()
    .oneOf([...disabilityTypeOptions])
    .when('disability_applied_to_or_received', {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t('disability.type_of_disability.errors.required')
        ),
    }),
  date_disability_began: yupDate(
    i18n_claimForm.t('disability.date_disability_began.label')
  )
    .max(
      dayjs(new Date()).format('YYYY-MM-DD'),
      i18n_claimForm.t('disability.date_disability_began.errors.maxDate')
    )
    .when('disability_applied_to_or_received', {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t('disability.date_disability_began.errors.required')
        ),
    }),

  recovery_date: yupDate(i18n_claimForm.t('disability.recovery_date.label'))
    .max(
      dayjs(new Date()).format('YYYY-MM-DD'),
      i18n_claimForm.t('disability.recovery_date.errors.maxDate')
    )
    .when('date_disability_began', {
      is: (dateValue: string | undefined) => {
        return !!dateValue
      },
      then: (schema) =>
        schema.min(
          ref('date_disability_began'),
          i18n_claimForm.t('disability.recovery_date.errors.minDate')
        ),
    })
    .when('disability_applied_to_or_received', {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t('disability.recovery_date.errors.required')
        ),
    }),
  contacted_last_employer_after_recovery: boolean().when(
    'disability_applied_to_or_received',
    {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'disability.contacted_last_employer_after_recovery.errors.required'
          )
        ),
    }
  ),
})

export const DisabilityPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('disability.heading'),
  path: Routes.CLAIM.DISABILITY,
  initialValues: {},
  validationSchema,
}

export default Disability
