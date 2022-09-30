import { NextPage } from 'next'
import { array, boolean, string, object, ref, mixed } from 'yup'
import { useFormikContext } from 'formik'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
  Fieldset,
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

export const AbleAndAvailable: NextPage = () => {
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
          {t('able_and_available.info_alert.title')}
        </SummaryBoxHeading>
        <SummaryBoxContent>
          <ul>
            <li>{t('able_and_available.info_alert.items.doctor_cert')}</li>
            <li>{t('able_and_available.info_alert.items.tdi')}</li>
            <li>{t('able_and_available.info_alert.items.workers_comp')}</li>
          </ul>
        </SummaryBoxContent>
      </SummaryBox>
      <YesNoQuestion
        name={'can_begin_work_immediately'}
        question={t('able_and_available.can_begin_work_immediately.label')}
      />
      <Fieldset
        legend={t('able_and_available.disability_applied_to_or_received.label')}
      >
        <CheckboxGroupField
          name="disability_applied_to_or_received"
          options={disabilityPaymentTypeOptions.map((paymentOption) => ({
            label: t(
              `able_and_available.disability_applied_to_or_received.options.${paymentOption}`
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
      </Fieldset>
      {hasCollectedDisability && (
        <>
          <YesNoQuestion
            question={t('able_and_available.disabled_immediately_before.label')}
            name="disabled_immediately_before"
          />
          <Fieldset
            legend={t('able_and_available.type_of_disability.label')}
            className={formStyles.field}
          >
            <RadioField
              name="type_of_disability"
              options={disabilityTypeOptions.map((option) => {
                return {
                  label: t(
                    `able_and_available.type_of_disability.options.${option}`
                  ),
                  value: option,
                }
              })}
            />
          </Fieldset>
          <DateInputField
            name="date_disability_began"
            legend={t('able_and_available.date_disability_began.label')}
          />
          <DateInputField
            name="recovery_date"
            legend={t('able_and_available.recovery_date.label')}
            hint={t('able_and_available.recovery_date.help_text')}
          />
          <YesNoQuestion
            question={t(
              'able_and_available.contacted_last_employer_after_recovery.label'
            )}
            name="contacted_last_employer_after_recovery"
          />
        </>
      )}
    </>
  )
}

const validationSchema = object().shape({
  can_begin_work_immediately: boolean().required(
    i18n_claimForm.t(
      'able_and_available.can_begin_work_immediately.errors.required'
    )
  ),
  disability_applied_to_or_received: array()
    .of(mixed().oneOf([...disabilityPaymentTypeOptions]))
    .when({
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('none'),
      then: array().max(
        1,
        i18n_claimForm.t(
          'able_and_available.disability_applied_to_or_received.errors.none_only'
        )
      ),
      otherwise: array().min(
        1,
        i18n_claimForm.t(
          'able_and_available.disability_applied_to_or_received.errors.required'
        )
      ),
    })
    .required(
      i18n_claimForm.t(
        'able_and_available.disability_applied_to_or_received.errors.required'
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
            'able_and_available.disabled_immediately_before.errors.required'
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
          i18n_claimForm.t(
            'able_and_available.type_of_disability.errors.required'
          )
        ),
    }),
  date_disability_began: yupDate(
    i18n_claimForm.t('able_and_available.date_disability_began.label')
  )
    .max(
      dayjs(new Date()).format('YYYY-MM-DD'),
      i18n_claimForm.t(
        'able_and_available.date_disability_began.errors.maxDate'
      )
    )
    .when('disability_applied_to_or_received', {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'able_and_available.date_disability_began.errors.required'
          )
        ),
    }),

  recovery_date: yupDate(
    i18n_claimForm.t('able_and_available.recovery_date.label')
  )
    .max(
      dayjs(new Date()).format('YYYY-MM-DD'),
      i18n_claimForm.t('able_and_available.recovery_date.errors.maxDate')
    )
    .when('date_disability_began', {
      is: (dateValue: string | undefined) => {
        return !!dateValue
      },
      then: (schema) =>
        schema.min(
          ref('date_disability_began'),
          i18n_claimForm.t('able_and_available.recovery_date.errors.minDate')
        ),
    })
    .when('disability_applied_to_or_received', {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t('able_and_available.recovery_date.errors.required')
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
            'able_and_available.contacted_last_employer_after_recovery.errors.required'
          )
        ),
    }
  ),
})

export const AbleAndAvailablePageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('able_and_available.heading'),
  path: Routes.CLAIM.ABLE_AND_AVAILABLE,
  initialValues: {},
  validationSchema,
}

export default AbleAndAvailable
