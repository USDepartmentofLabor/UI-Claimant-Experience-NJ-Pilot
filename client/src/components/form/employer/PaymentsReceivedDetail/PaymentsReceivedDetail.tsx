import { FormGroup } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

import TextAreaField from '../../fields/TextAreaField/TextAreaField'
import { DateInputField } from '../../fields/DateInputField/DateInputField'
import { CurrencyField } from '../../fields/CurrencyField/CurrencyField'
import { PayTypeOption } from 'constants/formOptions'

const PaymentsReceivedDetail = (props: {
  name: string
  payType: Exclude<PayTypeOption, 'none'>
  label: string
  description?: string
}) => {
  const { name, payType, label, description = '' } = props
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'employers',
  })
  const lowerLabel = label.charAt(0).toLowerCase() + label.slice(1)
  const showNote = payType === 'other_pay'
  const showDates =
    payType === 'vacation_sick_pto' || payType === 'severance_or_continuation'

  return (
    <div
      data-testid={`payDetail-${name}`}
      className="margin-top-4 margin-bottom-4"
    >
      <h3 className="font-heading-sm margin-bottom-1">{label}</h3>
      {description && (
        <p className="font-body-xs margin-top-0">{description}</p>
      )}
      <FormGroup>
        {showNote && (
          <TextAreaField
            name={`${name}.note`}
            label={t(
              'payments_received.payments_received_detail.other_note.label',
              {
                payType: lowerLabel,
              }
            )}
          />
        )}
        <CurrencyField
          name={`${name}.total`}
          label={t('payments_received.payments_received_detail.total.label', {
            payType: lowerLabel,
          })}
          inputPrefix={t(
            'payments_received.payments_received_detail.total.currencyPrefix'
          )}
        />
        {showDates && (
          <>
            <p>
              {name === 'vacation_sick_pto'
                ? t(
                    'payments_received.payments_received_detail.dates_hint.vacation_sick_pto'
                  )
                : t(
                    'payments_received.payments_received_detail.dates_hint.severance_or_continuation'
                  )}
            </p>
            <DateInputField
              legend={t(
                'payments_received.payments_received_detail.date_pay_began.label',
                {
                  payType: lowerLabel,
                }
              )}
              name={`${name}.date_pay_began`}
            />
            <DateInputField
              legend={t(
                'payments_received.payments_received_detail.date_pay_ended.label',
                {
                  payType: lowerLabel,
                }
              )}
              name={`${name}.date_pay_ended`}
            />
          </>
        )}
      </FormGroup>
    </div>
  )
}

export default PaymentsReceivedDetail
