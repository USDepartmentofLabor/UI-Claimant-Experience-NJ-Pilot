import dayjs from 'dayjs'
import { useFormikContext } from 'formik'
import { Employer, PaymentsReceivedDetailInput } from 'types/claimantInput'
import { array, boolean, object, mixed, ref, string } from 'yup'
import {
  yupDate,
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
} from 'constants/formOptions'
import { BusinessInterests } from 'components/form/employer/BusinessInterests/BusinessInterests'
import { ChangeInEmployment } from 'components/form/employer/ChangeInEmployment/ChangeInEmployment'
import { WorkLocation } from '../employer/WorkLocation/WorkLocation'
import PaymentsReceived from '../employer/PaymentsReceived/PaymentsReceived'
import {
  ADDRESS_WITHOUT_STREET_SKELETON,
  PHONE_SKELETON,
} from 'constants/initialValues'
import Error from 'next/error'
import { SummaryBox, SummaryBoxContent } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

export const EditEmployer = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  const { values } = useFormikContext<Employer>()

  if (!values) return <Error statusCode={404} />

  const isImported = values.is_imported

  return (
    <>
      {
        <div data-testid="edit-employer-component">
          <div data-testid="edit-employer-test-subheader">
            This is the employer name {values.name}
          </div>
          {isImported ? null /*(<VerifiedFields></VerifiedFields>)*/ : (
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

/* THIS IS WHERE YOU DEFINE THE INITIAL VALUES */
export const EMPLOYER_SKELETON = {
  name: '',
  isInitiated: true,
  // Your Employer
  is_full_time: undefined,
  // Work Location
  worked_at_employer_address: undefined,
  alternate_physical_work_address: { ...ADDRESS_WITHOUT_STREET_SKELETON },
  is_employer_phone_accurate: undefined,
  work_location_phone: { ...PHONE_SKELETON },
  // Business Interests
  self_employed: undefined,
  is_owner: undefined,
  corporate_officer_or_stock_ownership: undefined,
  employer_is_sole_proprietorship: undefined,
  related_to_owner_or_child_of_owner_under_18: undefined,
  // Change in Employment
  separation_circumstance: undefined,
  separation_circumstance_details: undefined,
  employment_start_date: undefined,
  employment_last_date: undefined,
  reason_still_employed: undefined,
  hours_reduced_twenty_percent: undefined,
  expect_to_be_recalled: undefined,
  definite_recall: undefined,
  definite_recall_date: undefined,
  is_seasonal_work: undefined,
  discharge_date: undefined,
  payments_received: [] as PaymentsReceivedDetailInput[],
  LOCAL_pay_types: [] as PayTypeOption[],
}

export const yupEditEmployer = object().shape({
  /* THIS IS WHERE WE DEFINE THE SCHEMA FOR THE EDIT EMPLOYER PAGE */
  name: string().required(i18n_claimForm.t('employers.name.required')),
  // Your Employer
  is_full_time: boolean().required(
    i18n_claimForm.t('employers.your_employer.is_full_time.errors.required')
  ),
  // Work Location
  worked_at_employer_address: boolean().required(
    i18n_claimForm.t(
      'employers.work_location.worked_at_employer_address.required'
    )
  ),
  alternate_physical_work_address: mixed().when('worked_at_employer_address', {
    is: false,
    then: yupAddressWithoutStreet(),
  }),
  is_employer_phone_accurate: boolean().required(
    i18n_claimForm.t(
      'employers.work_location.is_employer_phone_accurate.required'
    )
  ),
  work_location_phone: mixed().when('is_employer_phone_accurate', {
    is: false,
    then: yupPhone,
  }),
  // Business Interests
  self_employed: boolean().required(
    i18n_claimForm.t(
      'employers.business_interests.self_employed.errors.required'
    )
  ),
  is_owner: boolean().required(
    i18n_claimForm.t('employers.business_interests.is_owner.errors.required')
  ),
  corporate_officer_or_stock_ownership: boolean().required(
    i18n_claimForm.t('employers.business_interests.is_owner.errors.required')
  ),
  employer_is_sole_proprietorship: boolean().when(
    'corporate_officer_or_stock_ownership',
    {
      is: false,
      then: boolean().required(
        i18n_claimForm.t(
          'employers.business_interests.employer_is_sole_proprietorship.errors.required'
        )
      ),
    }
  ),
  related_to_owner_or_child_of_owner_under_18: string().when(
    'employer_is_sole_proprietorship',
    {
      is: false,
      then: (schema) =>
        schema
          .oneOf([...employerRelationOptions])
          .required(
            i18n_claimForm.t(
              'employers.business_interests.related_to_owner_or_child_of_owner_under_18.errors.required'
            )
          ),
    }
  ),
  // Change in Employment
  separation_circumstance: string()
    .oneOf([...changeInEmploymentOptions])
    .required(i18n_claimForm.t('employers.separation.reason.required')),
  expect_to_be_recalled: boolean().required(
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
  hours_reduced_twenty_percent: boolean().when('separation_circumstance', {
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
  is_seasonal_work: boolean().when('expect_to_be_recalled', {
    is: true,
    then: boolean().required(
      i18n_claimForm.t('employers.separation.is_seasonal_work.errors.required')
    ),
  }),
  definite_recall: boolean().when('expect_to_be_recalled', {
    is: true,
    then: boolean().required(
      i18n_claimForm.t('employers.separation.definite_recall.errors.required')
    ),
  }),
  definite_recall_date: yupDate(
    i18n_claimForm.t('employers.separation.definite_recall_date.label')
  ).when('definite_recall', {
    is: true,
    then: (schema) =>
      schema
        .min(
          ref('employment_last_date'),
          i18n_claimForm.t(
            'employers.separation.definite_recall_date.errors.minDate'
          )
        )
        .required(
          i18n_claimForm.t(
            'employers.separation.definite_recall_date.errors.required'
          )
        ),
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
            ['vacation_sick_pto', 'severance_or_continuation'].includes(
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
            ['vacation_sick_pto', 'severance_or_continuation'].includes(
              payType
            ),
          then: (schema) =>
            schema.required(
              i18n_claimForm.t(
                'employers.payments_received.payments_received_detail.date_pay_ended.errors.required'
              )
            ),
        }),
      note: string().when('pay_type', {
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
