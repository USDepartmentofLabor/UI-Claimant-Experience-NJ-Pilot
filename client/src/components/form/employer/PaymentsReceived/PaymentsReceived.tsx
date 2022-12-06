import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { CheckboxGroupField } from '../../fields/CheckboxGroupField/CheckboxGroupField'
import PaymentsReceivedDetail from '../PaymentsReceivedDetail/PaymentsReceivedDetail'
import { useFormikContext, FieldArray } from 'formik'
import { ClaimantInput, PaymentsReceivedDetailInput } from 'types/claimantInput'
import { payTypeOptions, PayTypeOption } from 'constants/formOptions'

type PaymentsReceivedProps = {
  employerIndex: number
}
const PaymentsReceived = ({ employerIndex }: PaymentsReceivedProps) => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'employers',
  })
  const { values, setFieldValue } = useFormikContext<ClaimantInput>()
  const employer = values.employers?.[`${employerIndex}`]
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

  const findIndexOfPaymentReceived = (payType: PayTypeOption) => {
    const paymentsReceived = employer?.payments_received
    return paymentsReceived?.findIndex((p) => p.pay_type === payType)
  }
  useEffect(() => {
    const paymentsReceived = employer?.payments_received || []
    // sets the local values for the checkboxes based on saved payment types
    if (paymentsReceived.length > 0) {
      const payTypes = paymentsReceived.map((detail) => detail.pay_type)
      setFieldValue(`employers[${employerIndex}].LOCAL_pay_types`, payTypes)
    } else {
      setFieldValue(`employers[${employerIndex}].LOCAL_pay_types`, [])
    }
  }, [employer?.payments_received.length])

  return (
    <>
      <h2 className="font-heading-sm">{t('payments_received.heading')}</h2>
      <FieldArray
        name={`employers[${employerIndex}].payments_received`}
        render={(arrayHelpers) => (
          <>
            <CheckboxGroupField
              name={`employers[${employerIndex}].LOCAL_pay_types`}
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
                      if (e.target.value === 'none') {
                        setFieldValue(
                          `employers[${employerIndex}].LOCAL_pay_types`,
                          ['none'],
                          true
                        )
                        setFieldValue(
                          `employers[${employerIndex}].payments_received`,
                          [{ pay_type: option }],
                          true
                        )
                      } else {
                        arrayHelpers.push({ pay_type: option })
                      }
                    } else {
                      const indexOfPaymentReceivedToRemove =
                        findIndexOfPaymentReceived(option)
                      indexOfPaymentReceivedToRemove !== undefined &&
                        arrayHelpers.remove(indexOfPaymentReceivedToRemove)
                    }
                  },
                  disabled:
                    employer?.LOCAL_pay_types?.includes('none') &&
                    option !== 'none',
                },
              }))}
            />
            {!!employer?.payments_received &&
              sortPayDetails(employer?.payments_received, [
                ...payTypeOptions,
              ]).map((paymentsReceivedDetail) => {
                const indexOfPaymentReceivedToDisplay =
                  findIndexOfPaymentReceived(paymentsReceivedDetail.pay_type)
                return (
                  paymentsReceivedDetail.pay_type !== 'none' && (
                    <PaymentsReceivedDetail
                      key={`employers[${employerIndex}].payments_received.${indexOfPaymentReceivedToDisplay}`}
                      name={`employers[${employerIndex}].payments_received.${indexOfPaymentReceivedToDisplay}`}
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
              })}
          </>
        )}
      />
    </>
  )
}

export default PaymentsReceived
