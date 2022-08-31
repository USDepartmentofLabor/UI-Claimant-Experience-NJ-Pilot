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
import { boolean, object, ref, string } from 'yup'

const PaymentInformation: NextPage = () => {
  const { values, setFieldValue, setFieldTouched } =
    useFormikContext<ClaimantInput>()
  const showDepositFields = values.payment_method === 'direct_deposit'
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'payment',
  })

  // TODO: useClearFields
  useEffect(() => {
    if (values.payment_method === 'debit') {
      const accountFields = [
        'account_type',
        'routing_number',
        'LOCAL_re_enter_routing_number',
        'account_number',
        'LOCAL_re_enter_account_number',
      ]

      accountFields.forEach((field) => {
        setFieldValue(field, undefined)
        setFieldTouched(field, false)
      })
    }
  }, [values.payment_method])

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
          name="payment_method"
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
              name="account_type"
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
            name="routing_number"
            type="text"
          />
          <TextField
            label={t('re_enter_routing_number.label')}
            name="LOCAL_re_enter_routing_number"
            type="text"
          />
          <TextField
            label={t('account_number.label')}
            name="account_number"
            type="text"
          />
          <TextField
            label={t('re_enter_account_number.label')}
            name="LOCAL_re_enter_account_number"
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
  initialValues: {},
  validationSchema: object().shape({
    federal_income_tax_withheld: boolean().required(
      i18n_claimForm.t('payment.federal_income_tax_withheld.errors.required')
    ),
    payment_method: string()
      .oneOf([...paymentMethodOptions])
      .required(i18n_claimForm.t('payment.payment_method.errors.required')),
    account_type: string()
      .oneOf([...accountTypeOptions])
      .when('payment_method', {
        is: 'direct_deposit',
        then: (schema) =>
          schema.required(
            i18n_claimForm.t('payment.account_type.errors.required')
          ),
      }),
    routing_number: string().when('payment_method', {
      is: 'direct_deposit',
      then: (schema) =>
        schema.required(
          i18n_claimForm.t('payment.routing_number.errors.required')
        ),
    }),
    LOCAL_re_enter_routing_number: string().when('payment_method', {
      is: 'direct_deposit',
      then: (schema) =>
        schema
          .oneOf(
            [ref('routing_number'), null],
            i18n_claimForm.t('payment.re_enter_routing_number.errors.mustMatch')
          )
          .required(
            i18n_claimForm.t('payment.re_enter_routing_number.errors.required')
          ),
    }),
    account_number: string().when('payment_method', {
      is: 'direct_deposit',
      then: (schema) =>
        schema.required(
          i18n_claimForm.t('payment.account_number.errors.required')
        ),
    }),
    LOCAL_re_enter_account_number: string().when('payment_method', {
      is: 'direct_deposit',
      then: (schema) =>
        schema
          .oneOf(
            [ref('account_number'), null],
            i18n_claimForm.t('payment.re_enter_account_number.errors.mustMatch')
          )
          .required(
            i18n_claimForm.t('payment.re_enter_account_number.errors.required')
          ),
    }),
  }),
}

export default PaymentInformation
