import { FormGroup, Fieldset } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

import TextAreaField from '../../fields/TextAreaField/TextAreaField'
import { DateInputField } from '../../fields/DateInputField/DateInputField'
import { CurrencyField } from '../../fields/CurrencyField/CurrencyField'
import { PayTypeOption, payTypesWithDates } from 'constants/formOptions'

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
  const showDates = payTypesWithDates.includes(payType)
  const dateHint = payType === 'holiday' ? 'holiday' : 'default'
  return (
    <Fieldset
      className="form-section"
      legend={<h3>{label}</h3>}
      data-testid={`payDetail-${name}`}
    >
      {description && <p className="margin-top-1">{description}</p>}
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
            characterLimit={1024}
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
            <p className="margin-top-3">
              {t(
                `payments_received.payments_received_detail.dates_hint.label.${dateHint}`
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
    </Fieldset>
  )
}

export default PaymentsReceivedDetail
