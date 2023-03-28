import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Fieldset } from '@trussworks/react-uswds'
import { CheckboxGroupField } from '../../fields/CheckboxGroupField/CheckboxGroupField'
import PaymentsReceivedDetail from '../PaymentsReceivedDetail/PaymentsReceivedDetail'
import { useFormikContext, FieldArray } from 'formik'
import { Employer, PaymentsReceivedDetailInput } from 'types/claimantInput'
import { payTypeOptions, PayTypeOption } from 'constants/formOptions'

const PaymentsReceived = () => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'employers',
  })
  const { values, setFieldValue } = useFormikContext<Employer>()
  const sortPayDetails = (
    paymentsReceivedArray: PaymentsReceivedDetailInput[],
    order: PayTypeOption[]
  ) => {
    const paymentsReceived = [...(paymentsReceivedArray || [])]
    paymentsReceived.sort(function (a, b) {
      const A = a.pay_type
      const B = b.pay_type

      if (order.indexOf(A) > order.indexOf(B)) {
        return 1
      } else {
        return -1
      }
    })

    return paymentsReceived
  }

  const createEmptyPayType = (
    option: PayTypeOption
  ): PaymentsReceivedDetailInput => ({
    pay_type: option,
    note: '',
    total: '',
    date_pay_began: '',
    date_pay_ended: '',
  })

  const findIndexOfPaymentReceived = (payType: PayTypeOption) => {
    const paymentsReceived = values.payments_received
    return paymentsReceived?.findIndex((p) => p.pay_type === payType)
  }
  useEffect(() => {
    const paymentsReceived = values.payments_received || []
    // sets the local values for the checkboxes based on saved payment types
    if (paymentsReceived.length > 0) {
      const payTypes = paymentsReceived.map((detail) => detail.pay_type)
      setFieldValue(`LOCAL_pay_types`, payTypes)
    } else {
      setFieldValue(`LOCAL_pay_types`, [])
    }
  }, [values.payments_received.length])

  return (
    <Fieldset
      className="form-section"
      legend={<h2>{t('payments_received.heading')}</h2>}
    >
      <FieldArray
        name={`payments_received`}
        render={(arrayHelpers) => (
          <>
            <CheckboxGroupField
              name={`LOCAL_pay_types`}
              legend={t(
                'payments_received.payments_received_detail.pay_type.label'
              )}
              options={payTypeOptions.map((option) => ({
                label: t(
                  `payments_received.payments_received_detail.pay_type.options.${option}.label`
                ),
                value: option,
                checkboxProps: {
                  'aria-description':
                    option === 'none'
                      ? t(
                          `payments_received.payments_received_detail.pay_type.options.none.ariaDescription`
                        )
                      : undefined,
                  labelDescription: t(
                    `payments_received.payments_received_detail.pay_type.options.${option}.description`
                  ),
                  tile: true,
                  onChange: (e) => {
                    if (e.target.checked) {
                      arrayHelpers.push(createEmptyPayType(option))
                    } else {
                      const indexOfPaymentReceivedToRemove =
                        findIndexOfPaymentReceived(option)
                      indexOfPaymentReceivedToRemove !== undefined &&
                        arrayHelpers.remove(indexOfPaymentReceivedToRemove)
                    }
                  },
                },
              }))}
            />
            {!!values.payments_received &&
              sortPayDetails(values.payments_received, [...payTypeOptions]).map(
                (paymentsReceivedDetail) => {
                  const indexOfPaymentReceivedToDisplay =
                    findIndexOfPaymentReceived(paymentsReceivedDetail.pay_type)
                  return (
                    paymentsReceivedDetail.pay_type !== 'none' && (
                      <PaymentsReceivedDetail
                        key={`payments_received.${indexOfPaymentReceivedToDisplay}`}
                        name={`payments_received.${indexOfPaymentReceivedToDisplay}`}
                        payType={paymentsReceivedDetail.pay_type}
                        label={t(
                          `payments_received.payments_received_detail.pay_type.options.${paymentsReceivedDetail.pay_type}.label`
                        )}
                        description={t(
                          `payments_received.payments_received_detail.pay_type.options.${paymentsReceivedDetail.pay_type}.description`
                        )}
                      />
                    )
                  )
                }
              )}
          </>
        )}
      />
    </Fieldset>
  )
}

export default PaymentsReceived
