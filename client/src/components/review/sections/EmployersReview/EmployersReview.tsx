import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { useTranslation } from 'next-i18next'
import { parseCityAndStateFromImportedAddress } from 'utils/employer/employerUtils'
import { Employer, PaymentsReceivedDetailInput } from 'types/claimantInput'
import { formatStoredDateToDisplayDate } from 'utils/date/format'
import {
  buildAlternateEmployerAddress,
  buildEmployerInputAddress,
  buildImportedEmployerAddress,
} from 'utils/address/format'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { EditEmployerPageDefinition } from 'constants/pages/definitions/editEmployerPageDefinition'
import { formatStoredToDisplayPhone } from 'utils/phone/format'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
import { HorizontalRule } from 'components/HorizonalRule/HorizontalRule'
import { convertCentsToDollars } from 'utils/currency/conversion'
import { Trans } from 'react-i18next'
import { payTypeOptions, PayTypeOption } from 'constants/formOptions'

export const PaymentReview = ({
  paymentDetail,
  payTypeOption,
}: {
  paymentDetail: PaymentsReceivedDetailInput
  payTypeOption: PayTypeOption
}) => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'employers.payments_received.payments_received_detail',
  })

  const payTypeString = t(
    `pay_type.options.${payTypeOption}.label`
  ).toLowerCase()
  const paymentTotal = paymentDetail.total
    ? `${t('total.currencyPrefix')}${convertCentsToDollars(
        paymentDetail.total
      )}`
    : undefined
  return (
    <>
      <ReviewElement
        label={t('other_note.reviewLabel', { payType: payTypeString })}
        value={paymentDetail.note}
      />
      <ReviewElement
        label={t('total.reviewLabel', { payType: payTypeString })}
        value={paymentTotal}
      />
      <ReviewElement
        label={t('date_pay_began.reviewLabel', { payType: payTypeString })}
        value={formatStoredDateToDisplayDate(paymentDetail.date_pay_began)}
      />
      <ReviewElement
        label={t('date_pay_ended.reviewLabel', { payType: payTypeString })}
        value={formatStoredDateToDisplayDate(paymentDetail.date_pay_ended)}
      />
    </>
  )
}
export const PaymentsReview = ({
  paymentsReceivedArray,
}: {
  paymentsReceivedArray: PaymentsReceivedDetailInput[]
}) => {
  if (
    paymentsReceivedArray === undefined ||
    paymentsReceivedArray.length === 0 ||
    (paymentsReceivedArray.length == 1 &&
      paymentsReceivedArray[0].pay_type === 'none')
  ) {
    return null
  }
  const findIndexOfPaymentReceived = (payType: PayTypeOption) => {
    const x = paymentsReceivedArray?.findIndex((p) => p.pay_type === payType)
    return x
  }

  return (
    <>
      {payTypeOptions.map(
        (payType) =>
          findIndexOfPaymentReceived(payType) > -1 && (
            <PaymentReview
              key={payType}
              payTypeOption={payType}
              paymentDetail={
                paymentsReceivedArray[findIndexOfPaymentReceived(payType)]
              }
            />
          )
      )}
    </>
  )
}
export const EmployerReview = ({
  employer,
  index,
  isFirstEmployer,
  hideEditUrl,
}: {
  employer: Employer
  index: number
  isFirstEmployer: boolean
  hideEditUrl: boolean
}) => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  let { path } = EditEmployerPageDefinition
  path = path + '/' + String(index)
  if (
    !employer.worked_for_imported_employer_in_last_18mo &&
    employer.is_imported
  ) {
    return null
  }
  const employerCityAndState =
    employer.is_imported && employer.imported_address
      ? parseCityAndStateFromImportedAddress(employer.imported_address)
      : {
          city: employer?.employer_address?.city,
          state: employer?.employer_address?.state,
        }
  const formatPaymentsReceivedList = (
    paymentsReceived: PaymentsReceivedDetailInput[]
  ) => {
    if (paymentsReceived === undefined) {
      return undefined
    }

    let paymentListString = ''
    for (const payment of paymentsReceived) {
      if (paymentListString !== '') {
        paymentListString = paymentListString.concat('\n')
      }

      paymentListString = paymentListString.concat(
        t(
          `payments_received.payments_received_detail.pay_type.options.${payment.pay_type}.label`
        )
      )
    }

    return paymentListString
  }

  const buildFullTimeReviewAnswer = (isFullTime: boolean | null) => {
    return isFullTime === true || isFullTime === false
      ? isFullTime
        ? t('your_employer.is_full_time.options.full_time')
        : t('your_employer.is_full_time.options.part_time')
      : null
  }

  return (
    <>
      {!isFirstEmployer && <HorizontalRule />}
      <ReviewSection
        heading={employer.employer_name}
        editUrl={!hideEditUrl ? path : undefined}
      >
        <ReviewElement
          label={t('verified_fields.employer_address')}
          value={buildImportedEmployerAddress(employer?.imported_address)}
        />
        <ReviewElement
          label={t('verified_fields.employer_address')}
          value={buildEmployerInputAddress(employer?.employer_address)}
        />
        <ReviewElement
          label={t('verified_fields.employer_phone')}
          value={formatStoredToDisplayPhone(employer?.employer_phone?.number)}
        />
        <ReviewElement
          label={t('verified_fields.fein')}
          value={employer?.fein}
        />
        <ReviewElement
          label={t('your_employer.state_employer_payroll_number.review_label')}
          value={employer?.state_employer_payroll_number}
        />
        <ReviewElement
          label={t('your_employer.is_full_time.label')}
          value={buildFullTimeReviewAnswer(employer?.is_full_time)}
        />
        <ReviewYesNo
          label={
            <Trans
              t={t}
              i18nKey="work_location.worked_at_employer_address.label"
            >
              {employerCityAndState.city}
              {employerCityAndState.state}
            </Trans>
          }
          value={employer?.worked_at_employer_address}
        />
        <ReviewElement
          label={t('work_location.section_title')}
          value={buildAlternateEmployerAddress(
            employer.alternate_physical_work_address
          )}
        />
        <ReviewYesNo
          label={
            <Trans
              t={t}
              i18nKey="work_location.is_employer_phone_accurate.label"
            >
              {formatStoredToDisplayPhone(employer.employer_phone?.number)}
            </Trans>
          }
          value={employer?.is_employer_phone_accurate}
        />
        <ReviewElement
          label={t('alt_employer_phone')}
          value={formatStoredToDisplayPhone(
            employer?.work_location_phone?.number
          )}
        />
        <ReviewYesNo
          label={t('business_interests.self_employed.label')}
          value={employer?.self_employed}
        />
        <ReviewYesNo
          label={t('business_interests.is_owner.label')}
          value={employer?.is_owner}
        />
        <ReviewYesNo
          label={t(
            'business_interests.corporate_officer_or_stock_ownership.label'
          )}
          value={employer?.corporate_officer_or_stock_ownership}
        />
        <ReviewElement
          label={t('business_interests.employer_is_sole_proprietorship.label')}
          value={
            employer.employer_is_sole_proprietorship &&
            t(
              `business_interests.employer_is_sole_proprietorship.options.${employer.employer_is_sole_proprietorship}`
            )
          }
        />

        <ReviewElement
          label={t(
            'business_interests.related_to_owner_or_child_of_owner_under_18.label'
          )}
          value={
            employer.related_to_owner_or_child_of_owner_under_18 &&
            t(
              `business_interests.related_to_owner_or_child_of_owner_under_18.options.${employer.related_to_owner_or_child_of_owner_under_18}.label`
            )
          }
        />
        <ReviewElement
          label={t('separation.reason.label')}
          value={
            employer.separation_circumstance &&
            t(`separation.reasons.${employer.separation_circumstance}.label`)
          }
        />
        <ReviewElement
          label={t('separation.reasons.still_employed.option_heading')}
          value={
            employer?.reason_still_employed &&
            t(
              `separation.reasons.still_employed.options.${employer.reason_still_employed}`
            )
          }
        />
        <ReviewElement
          label={t('separation.separation_circumstance_details.required_label')}
          value={employer.separation_circumstance_details}
        />
        <ReviewElement
          label={t('employment_start_date.label')}
          value={formatStoredDateToDisplayDate(employer.employment_start_date)}
        />
        <ReviewElement
          label={t('employment_last_date.label')}
          value={formatStoredDateToDisplayDate(employer.employment_last_date)}
        />
        <ReviewYesNo
          label={t('hours_reduced_twenty_percent.label')}
          value={employer.hours_reduced_twenty_percent}
        />
        <ReviewElement
          label={t('discharge_date.label')}
          value={formatStoredDateToDisplayDate(employer.discharge_date)}
        />
        <ReviewYesNo
          label={t('separation.expect_to_be_recalled.label')}
          value={employer.expect_to_be_recalled}
        />
        <ReviewYesNo
          label={t('separation.definite_recall.label')}
          value={employer.definite_recall}
        />
        <ReviewElement
          label={t('separation.definite_recall_date.label')}
          value={formatStoredDateToDisplayDate(employer.definite_recall_date)}
        />
        <ReviewYesNo
          label={t('separation.is_seasonal_work.label')}
          value={employer.is_seasonal_work}
        />
        <ReviewElement
          label={t('payments_received.payments_received_detail.pay_type.label')}
          value={formatPaymentsReceivedList(employer.payments_received)}
        />
        <PaymentsReview paymentsReceivedArray={employer.payments_received} />
      </ReviewSection>
    </>
  )
}

export const EmployersReview = () => {
  const { claimFormValues, hideEditUrl } = useContext(ClaimFormContext)
  const getFirstEmployerIndex = (employers: Employer[] | undefined) => {
    if (employers && employers.length > 0) {
      return employers.findIndex(
        (employer) =>
          (employer?.worked_for_imported_employer_in_last_18mo &&
            employer.is_imported) ||
          !employer?.is_imported
      )
    }

    return -1
  }

  const firstEmployerIndex = getFirstEmployerIndex(claimFormValues?.employers)
  return (
    <>
      {claimFormValues?.employers &&
        firstEmployerIndex > -1 &&
        claimFormValues?.employers.map((employer, idx) => (
          <EmployerReview
            employer={employer}
            index={idx}
            isFirstEmployer={idx === firstEmployerIndex}
            key={idx}
            hideEditUrl={hideEditUrl || false}
          />
        ))}
      {firstEmployerIndex > -1 && <HorizontalRule />}
    </>
  )
}
