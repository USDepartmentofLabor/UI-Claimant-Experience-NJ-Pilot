import dayjs from 'dayjs'
import { useFormikContext } from 'formik'
import { Employer, PaymentsReceivedDetailInput } from 'types/claimantInput'
import { array, boolean, object, mixed, ref, string } from 'yup'
import {
  yupDate,
  yupEmployerAddress,
  yupAddressWithoutStreet,
  yupCurrency,
  yupPhone,
} from 'validations/yup/custom'
import { i18n_claimForm } from 'i18n/i18n'
import { YourEmployer } from 'components/form/employer/YourEmployer/YourEmployer'
import {
  ChangeInEmploymentOption,
  changeInEmploymentOptions,
  employerRelationOptions,
  reasonStillEmployedOptions,
  PayTypeOption,
  payTypeOptions,
  UNTOUCHED_RADIO_VALUE,
} from 'constants/formOptions'
import { BusinessInterests } from 'components/form/employer/BusinessInterests/BusinessInterests'
import { ChangeInEmployment } from 'components/form/employer/ChangeInEmployment/ChangeInEmployment'
import { WorkLocation } from '../employer/WorkLocation/WorkLocation'
import PaymentsReceived from '../employer/PaymentsReceived/PaymentsReceived'
import {
  ADDRESS_WITHOUT_STREET_SKELETON,
  EMPLOYER_ADDRESS_SKELETON,
  PHONE_SKELETON,
} from 'constants/initialValues'
import Error from 'next/error'
import { SummaryBox, SummaryBoxContent } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { VerifiedFields } from 'components/form/VerifiedFields/VerifiedFields'
import { VerifiedField } from 'components/form/VerifiedFields/VerifiedField/VerifiedField'
import { formatStoredToDisplayPhone } from 'utils/phone/format'

export const EditEmployer = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  const { t: tCommon } = useTranslation('common')
  const { values } = useFormikContext<Employer>()
  if (!values)
    return <Error title={tCommon('errorStatus.404')} statusCode={404} />

  const isImported = values.is_imported

  return (
    <>
      {
        <div data-testid="edit-employer-component">
          {isImported ? (
            <VerifiedFields>
              <VerifiedField
                label={t('verified_fields.employer_name')}
                value={values.employer_name}
              />
              {values.imported_address &&
                (values.imported_address.employerAddressLine1 ||
                  values.imported_address.employerAddressLine2 ||
                  values.imported_address.employerAddressLine3 ||
                  values.imported_address.employerAddressLine4 ||
                  values.imported_address.employerAddressLine5 ||
                  values.imported_address.employerAddressZip) && (
                  <VerifiedField label={t('verified_fields.employer_address')}>
                    {values.imported_address?.employerAddressLine1 && (
                      <div>{values.imported_address?.employerAddressLine1}</div>
                    )}
                    {values.imported_address?.employerAddressLine2 && (
                      <div>{values.imported_address?.employerAddressLine2}</div>
                    )}
                    {values.imported_address?.employerAddressLine3 && (
                      <div>{values.imported_address?.employerAddressLine3}</div>
                    )}
                    {values.imported_address?.employerAddressLine4 && (
                      <div>{values.imported_address?.employerAddressLine4}</div>
                    )}
                    {values.imported_address?.employerAddressLine5 && (
                      <div>{values.imported_address?.employerAddressLine5}</div>
                    )}
                    {values.imported_address?.employerAddressZip && (
                      <div>{values.imported_address?.employerAddressZip}</div>
                    )}
                  </VerifiedField>
                )}
              <VerifiedField
                label={t('verified_fields.employer_phone')}
                value={formatStoredToDisplayPhone(
                  values.employer_phone?.number
                )}
              />
              <VerifiedField
                label={t('verified_fields.fein')}
                value={values.fein}
              />
            </VerifiedFields>
          ) : (
            <SummaryBox>
              <SummaryBoxContent>{t('preamble')}</SummaryBoxContent>
            </SummaryBox>
          )}
          <YourEmployer />
          <WorkLocation />
          <BusinessInterests />
          <ChangeInEmployment />
          <PaymentsReceived />
        </div>
      }
    </>
  )
}

export const EMPLOYER_SKELETON: Employer = {
  is_imported: false, // Default to false. Imported employers override to true
  worked_for_imported_employer_in_last_18mo: UNTOUCHED_RADIO_VALUE,
  imported_address: null,
  // Your Employer
  employer_name: '',
  fein: '',
  employer_address: { ...EMPLOYER_ADDRESS_SKELETON },
  employer_phone: { ...PHONE_SKELETON },
  is_full_time: UNTOUCHED_RADIO_VALUE,
  // Work Location
  worked_at_employer_address: UNTOUCHED_RADIO_VALUE,
  alternate_physical_work_address: { ...ADDRESS_WITHOUT_STREET_SKELETON },
  is_employer_phone_accurate: UNTOUCHED_RADIO_VALUE,
  work_location_phone: { ...PHONE_SKELETON },
  // Business Interests
  self_employed: UNTOUCHED_RADIO_VALUE,
  is_owner: UNTOUCHED_RADIO_VALUE,
  corporate_officer_or_stock_ownership: UNTOUCHED_RADIO_VALUE,
  employer_is_sole_proprietorship: UNTOUCHED_RADIO_VALUE,
  related_to_owner_or_child_of_owner_under_18: UNTOUCHED_RADIO_VALUE,
  // Change in Employment
  separation_circumstance: UNTOUCHED_RADIO_VALUE,
  separation_circumstance_details: '',
  employment_start_date: '',
  employment_last_date: '',
  reason_still_employed: '',
  hours_reduced_twenty_percent: UNTOUCHED_RADIO_VALUE,
  expect_to_be_recalled: UNTOUCHED_RADIO_VALUE,
  definite_recall: UNTOUCHED_RADIO_VALUE,
  definite_recall_date: '',
  is_seasonal_work: UNTOUCHED_RADIO_VALUE,
  discharge_date: '',
  // Other pay
  payments_received: [] as PaymentsReceivedDetailInput[],
  LOCAL_pay_types: [] as PayTypeOption[],
}

export const yupEditEmployer = object().shape({
  // Your Employer
  employer_name: string()
    .trim()
    .when('is_imported', {
      is: false,
      then: string()
        .max(
          40,
          i18n_claimForm.t(
            'employers.your_employer.employer_name.errors.maxLength'
          )
        )
        .required(
          i18n_claimForm.t(
            'employers.your_employer.employer_name.errors.required'
          )
        ),
    }),
  fein: string().when('is_imported', {
    is: false,
    then: (schema) =>
      schema
        .nullable()
        .max(
          15,
          i18n_claimForm.t('employers.your_employer.fein.errors.maxLength')
        )
        .matches(
          /^[\d]{0,15}$/,
          i18n_claimForm.t('employers.your_employer.fein.errors.digitsOnly')
        ),
  }),
  employer_address: mixed().when('is_imported', {
    is: false,
    then: yupEmployerAddress(),
  }),
  employer_phone: mixed().when('is_imported', {
    is: false,
    then: yupPhone,
  }),
  is_full_time: boolean()
    .nullable()
    .required(
      i18n_claimForm.t('employers.your_employer.is_full_time.errors.required')
    ),
  // Work Location
  worked_at_employer_address: boolean()
    .nullable()
    .required(
      i18n_claimForm.t(
        'employers.work_location.worked_at_employer_address.required'
      )
    ),
  alternate_physical_work_address: mixed().when('worked_at_employer_address', {
    is: false,
    then: yupAddressWithoutStreet(),
  }),
  is_employer_phone_accurate: boolean()
    .nullable()
    .required(
      i18n_claimForm.t(
        'employers.work_location.is_employer_phone_accurate.required'
      )
    ),
  work_location_phone: mixed().when('is_employer_phone_accurate', {
    is: false,
    then: yupPhone,
  }),
  // Business Interests
  self_employed: boolean()
    .nullable()
    .required(
      i18n_claimForm.t(
        'employers.business_interests.self_employed.errors.required'
      )
    ),
  is_owner: boolean()
    .nullable()
    .required(
      i18n_claimForm.t('employers.business_interests.is_owner.errors.required')
    ),
  corporate_officer_or_stock_ownership: boolean()
    .nullable()
    .required(
      i18n_claimForm.t('employers.business_interests.is_owner.errors.required')
    ),
  employer_is_sole_proprietorship: boolean()
    .nullable()
    .when('corporate_officer_or_stock_ownership', {
      is: false,
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'employers.business_interests.employer_is_sole_proprietorship.errors.required'
          )
        ),
    }),
  related_to_owner_or_child_of_owner_under_18: string()
    .nullable()
    .when('employer_is_sole_proprietorship', {
      is: true,
      then: (schema) =>
        schema
          .oneOf([...employerRelationOptions])
          .required(
            i18n_claimForm.t(
              'employers.business_interests.related_to_owner_or_child_of_owner_under_18.errors.required'
            )
          ),
    }),
  // Change in Employment
  separation_circumstance: string()
    .oneOf([...changeInEmploymentOptions])
    .nullable()
    .required(i18n_claimForm.t('employers.separation.reason.required')),
  expect_to_be_recalled: boolean()
    .nullable()
    .required(
      i18n_claimForm.t(
        'employers.separation.expect_to_be_recalled.errors.required'
      )
    ),
  separation_circumstance_details: string()
    .trim()
    .max(
      255,
      i18n_claimForm.t(
        'employers.separation.separation_circumstance_details.errors.max_length'
      )
    )
    .when('separation_circumstance', {
      is: (changeInEmploymentReason: ChangeInEmploymentOption) =>
        [
          'fired_discharged_suspended',
          'unsatisfactory_work_performance',
          'quit_or_retired',
          'strike_or_lock_out_by_employer',
        ].includes(changeInEmploymentReason),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'employers.separation.separation_circumstance_details.errors.required'
          )
        ),
    }),
  employment_start_date: yupDate(
    i18n_claimForm.t('employers.employment_start_date.label')
  )
    .max(
      dayjs(new Date()).format('YYYY-MM-DD'),
      i18n_claimForm.t('employers.employment_start_date.errors.maxDate')
    )
    .required(
      i18n_claimForm.t('employers.employment_start_date.errors.required')
    ),
  employment_last_date: yupDate(
    i18n_claimForm.t('employers.employment_last_date.label')
  )
    .max(
      dayjs(new Date()).format('YYYY-MM-DD'),
      i18n_claimForm.t('employers.employment_last_date.errors.maxDate')
    )
    .when('employment_start_date', {
      is: (dateValue: string | undefined) => {
        return !!dateValue
      },
      then: (schema) =>
        schema.min(
          ref('employment_start_date'),
          i18n_claimForm.t('employers.employment_last_date.errors.minDate')
        ),
    })
    .required(
      i18n_claimForm.t('employers.employment_last_date.errors.required')
    ),

  reason_still_employed: string()
    .oneOf([...reasonStillEmployedOptions])
    .when('separation_circumstance', {
      is: 'still_employed',
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'employers.separation.reasons.still_employed.errors.required'
          )
        ),
    }),
  hours_reduced_twenty_percent: boolean()
    .nullable()
    .when('separation_circumstance', {
      is: 'still_employed',
      then: (schema) =>
        schema.when('reason_still_employed', {
          is: 'reduction_in_hours_by_employer',
          then: (schema) =>
            schema.required(
              i18n_claimForm.t(
                'employers.hours_reduced_twenty_percent.errors.required'
              )
            ),
        }),
    }),
  discharge_date: yupDate(
    i18n_claimForm.t('employers.discharge_date.errors.date_format')
  )
    .max(
      dayjs(new Date()).format('YYYY-MM-DD'),
      i18n_claimForm.t('employers.discharge_date.errors.maxDate')
    )
    .when('employment_last_date', {
      is: (dateValue: string | undefined) => {
        return !!dateValue
      },
      then: (schema) =>
        schema.min(
          ref('employment_last_date'),
          i18n_claimForm.t('employers.discharge_date.errors.minDate')
        ),
    })
    .when('separation_circumstance', {
      is: (changeInEmploymentReason: ChangeInEmploymentOption) =>
        changeInEmploymentReason?.includes('fired_discharged_suspended'),
      then: (schema) =>
        schema.required(
          i18n_claimForm.t('employers.discharge_date.errors.required')
        ),
    }),
  is_seasonal_work: boolean()
    .nullable()
    .when('expect_to_be_recalled', {
      is: true,
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'employers.separation.is_seasonal_work.errors.required'
          )
        ),
    }),
  definite_recall: boolean()
    .nullable()
    .when('expect_to_be_recalled', {
      is: true,
      then: (schema) =>
        schema.required(
          i18n_claimForm.t(
            'employers.separation.definite_recall.errors.required'
          )
        ),
    }),
  definite_recall_date: yupDate(
    i18n_claimForm.t('employers.separation.definite_recall_date.label')
  ).when('definite_recall', {
    is: true,
    then: (schema) => {
      return schema
        .test({
          name: 'min',
          exclusive: false,
          message: i18n_claimForm.t(
            'employers.separation.definite_recall_date.errors.minDate'
          ),
          test: (value, context) =>
            (value as Date) > context.parent.employment_last_date,
        })
        .required(
          i18n_claimForm.t(
            'employers.separation.definite_recall_date.errors.required'
          )
        )
    },
  }),

  // Payments received
  LOCAL_pay_types: array().when('payments_received', {
    is: (paymentsReceived: PaymentsReceivedDetailInput[]) =>
      !paymentsReceived || !paymentsReceived.length,
    then: array().min(
      1,
      i18n_claimForm.t(
        'employers.payments_received.payments_received_detail.pay_type.errors.required'
      )
    ),
  }),
  payments_received: array().of(
    object({
      pay_type: mixed().oneOf(payTypeOptions.map((value) => value)),
      total: yupCurrency(
        i18n_claimForm.t(
          'employers.payments_received.payments_received_detail.total.errors.number'
        )
      ).when('pay_type', {
        is: 'none',
        otherwise: string().required(
          i18n_claimForm.t(
            'employers.payments_received.payments_received_detail.total.errors.required'
          )
        ),
      }),
      date_pay_began: yupDate(
        i18n_claimForm.t(
          'employers.payments_received.payments_received_detail.date_pay_began.label'
        )
      )
        .max(
          dayjs(new Date()).format('YYYY-MM-DD'),
          i18n_claimForm.t(
            'employers.payments_received.payments_received_detail.date_pay_began.errors.max'
          )
        )
        .when('pay_type', {
          is: (payType: PayTypeOption) =>
            ['holiday', 'payment_in_lieu_of_notice', 'continuation'].includes(
              payType
            ),
          then: (schema) =>
            schema.required(
              i18n_claimForm.t(
                'employers.payments_received.payments_received_detail.date_pay_began.errors.required'
              )
            ),
        }),
      date_pay_ended: yupDate(
        i18n_claimForm.t(
          'employers.payments_received.payments_received_detail.date_pay_ended.label'
        )
      )
        .max(
          dayjs(new Date()).format('YYYY-MM-DD'),
          i18n_claimForm.t(
            'employers.payments_received.payments_received_detail.date_pay_ended.errors.max'
          )
        )
        .when('date_pay_began', {
          is: (dateValue: string | undefined) => {
            return !!dateValue
          },
          then: (schema) =>
            schema.min(
              ref('date_pay_began'),
              i18n_claimForm.t(
                'employers.payments_received.payments_received_detail.date_pay_ended.errors.min'
              )
            ),
        })
        .when('pay_type', {
          is: (payType: PayTypeOption) =>
            ['holiday', 'payment_in_lieu_of_notice', 'continuation'].includes(
              payType
            ),
          then: (schema) =>
            schema.required(
              i18n_claimForm.t(
                'employers.payments_received.payments_received_detail.date_pay_ended.errors.required'
              )
            ),
        }),
      note: string()
        .trim()
        .max(
          1024,
          i18n_claimForm.t(
            'employers.payments_received.payments_received_detail.other_note.errors.maxLength'
          )
        )
        .when('pay_type', {
          is: 'other_pay',
          then: (schema) =>
            schema.required(
              i18n_claimForm.t(
                'employers.payments_received.payments_received_detail.other_note.errors.required'
              )
            ),
        }),
    })
  ),
})

export const yupEditEmployers = object().shape({
  employers: array().of(yupEditEmployer),
})
