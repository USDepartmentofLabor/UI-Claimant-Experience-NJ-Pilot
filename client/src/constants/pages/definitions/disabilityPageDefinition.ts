import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { array, boolean, mixed, object, ref, string } from 'yup'
import {
  DisabilityPaymentTypeOption,
  disabilityPaymentTypeOptions,
  disabilityTypeOptions,
} from 'constants/formOptions'
import { yupDate } from 'validations/yup/custom'
import dayjs from 'dayjs'

const validationSchema = object().shape({
  disability_applied_to_or_received: array()
    .of(mixed().oneOf([...disabilityPaymentTypeOptions]))
    .when({
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('none'),
      then: (schema) =>
        schema.max(
          1,
          i18n_claimForm.t(
            'disability.disability_applied_to_or_received.errors.none_only'
          )
        ),
      otherwise: (schema) =>
        schema.min(
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
  disabled_immediately_before: boolean()
    .nullable()
    .when('disability_applied_to_or_received', {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'disability.disabled_immediately_before.errors.required'
          )
        ),
    }),
  type_of_disability: string()
    .nullable()
    .when('disability_applied_to_or_received', {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema
          .oneOf([...disabilityTypeOptions])
          .required(
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
  contacted_last_employer_after_recovery: boolean()
    .nullable()
    .when('disability_applied_to_or_received', {
      is: (disabilityPaymentType: DisabilityPaymentTypeOption) =>
        disabilityPaymentType?.includes('disability') ||
        disabilityPaymentType?.includes('family_leave'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'disability.contacted_last_employer_after_recovery.errors.required'
          )
        ),
    }),
})

export const DisabilityPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('disability.heading'),
  path: Routes.CLAIM.DISABILITY,
  validationSchema,
}
