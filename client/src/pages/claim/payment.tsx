import { NextPage } from 'next'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Fieldset } from '@trussworks/react-uswds'

import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { TextField } from 'components/form/fields/TextField/TextField'
import { useFormikContext } from 'formik'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import HelpText from 'components/HelpText/HelpText'
import { accountTypeOptions, paymentMethodOptions } from 'constants/formOptions'
import { ClaimantInput } from 'types/claimantInput'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
import { i18n_claimForm } from 'i18n/i18n'
import { mixed, object, ref } from 'yup'

const PaymentInformation: NextPage = () => {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<ClaimantInput>()
  const showDepositFields = values.payment?.payment_method === 'direct_deposit'
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'payment',
  })

  useEffect(() => {
    if (values.payment?.payment_method === 'debit') {
      const accountFields = [
        'account_type',
        'routing_number',
        'LOCAL_re_enter_routing_number',
        'account_number',
        'LOCAL_re_enter_account_number',
      ]

      accountFields.forEach((field) => {
        setFieldValue(`payment.${field}`, undefined)
        setFieldTouched(`payment.${field}`, false)
      })
    }
  }, [values.payment?.payment_method])

  return (
    <>
      <YesNoQuestion
        question={t('federal_income_tax_withheld.label')}
        name="federal_income_tax_withheld"
      >
        <HelpText withLeftBorder={true}>
          {t('federal_income_tax_withheld.help_text')}
        </HelpText>
      </YesNoQuestion>
      <Fieldset legend={t('payment_method.label')}>
        <RadioField
          name="payment.payment_method"
          options={paymentMethodOptions.map((option) => {
            return {
              label: t(`payment_method.options.${option}`),
              value: option,
            }
          })}
        />
      </Fieldset>
      {showDepositFields && (
        <>
          <Fieldset legend={t('account_type.label')}>
            <RadioField
              name="payment.account_type"
              options={accountTypeOptions.map((option) => {
                return {
                  label: t(`account_type.options.${option}`),
                  value: option,
                }
              })}
            />
          </Fieldset>
          <TextField
            label={t('routing_number.label')}
            name="payment.routing_number"
            type="text"
          />
          <TextField
            label={t('re_enter_routing_number.label')}
            name="payment.LOCAL_re_enter_routing_number"
            type="text"
          />
          <TextField
            label={t('account_number.label')}
            name="payment.account_number"
            type="text"
          />
          <TextField
            label={t('re_enter_account_number.label')}
            name="payment.LOCAL_re_enter_account_number"
            type="text"
          />
        </>
      )}
    </>
  )
}

export const PaymentPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('payment.heading'),
  path: Routes.CLAIM.PAYMENT,
  initialValues: { payment: {} },
  validationSchema: object().shape({
    federal_income_tax_withheld: mixed()
      .oneOf([true, false])
      .required(
        i18n_claimForm.t('payment.federal_income_tax_withheld.errors.required')
      ),
    payment: object().shape({
      payment_method: mixed()
        .oneOf([...paymentMethodOptions])
        .required(i18n_claimForm.t('payment.payment_method.errors.required')),
      account_type: mixed()
        .oneOf([...accountTypeOptions])
        .when('payment_method', {
          is: 'direct_deposit',
          then: mixed().required(
            i18n_claimForm.t('payment.account_type.errors.required')
          ),
        }),
      routing_number: mixed().when('payment_method', {
        is: 'direct_deposit',
        then: mixed().required(
          i18n_claimForm.t('payment.routing_number.errors.required')
        ),
      }),
      LOCAL_re_enter_routing_number: mixed().when('payment_method', {
        is: 'direct_deposit',
        then: mixed()
          .oneOf(
            [ref('routing_number'), null],
            i18n_claimForm.t('payment.re_enter_routing_number.errors.mustMatch')
          )
          .required(
            i18n_claimForm.t('payment.re_enter_routing_number.errors.required')
          ),
      }),
      account_number: mixed().when('payment_method', {
        is: 'direct_deposit',
        then: mixed().required(
          i18n_claimForm.t('payment.account_number.errors.required')
        ),
      }),
      LOCAL_re_enter_account_number: mixed().when('payment_method', {
        is: 'direct_deposit',
        then: mixed()
          .oneOf(
            [ref('account_number'), null],
            i18n_claimForm.t('payment.re_enter_account_number.errors.mustMatch')
          )
          .required(
            i18n_claimForm.t('payment.re_enter_account_number.errors.required')
          ),
      }),
    }),
  }),
}

export default PaymentInformation
