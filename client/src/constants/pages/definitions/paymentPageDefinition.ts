import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { boolean, object, ref, string } from 'yup'
import { accountTypeOptions, paymentMethodOptions } from 'constants/formOptions'

export const PaymentPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('payment.heading'),
  path: Routes.CLAIM.PAYMENT,
  validationSchema: object().shape({
    payment_method: string()
      .oneOf([...paymentMethodOptions])
      .nullable()
      .required(i18n_claimForm.t('payment.payment_method.errors.required')),
    account_type: string()
      .nullable()
      .when('payment_method', {
        is: 'direct_deposit',
        then: (schema) =>
          schema
            .oneOf([...accountTypeOptions])
            .required(i18n_claimForm.t('payment.account_type.errors.required')),
      }),
    routing_number: string()
      .matches(
        /^\d+$/,
        i18n_claimForm.t('payment.routing_number.errors.digitsOnly')
      )
      .length(
        9,
        i18n_claimForm.t('payment.routing_number.errors.incorrectLength')
      )
      .when('payment_method', {
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
    account_number: string()
      .matches(
        /^\d+$/,
        i18n_claimForm.t('payment.account_number.errors.digitsOnly')
      )
      .max(17, i18n_claimForm.t('payment.account_number.errors.maxLength'))
      .when('payment_method', {
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
    acknowledge_direct_deposit_option: boolean().when('payment_method', {
      is: 'direct_deposit',
      then: (schema) =>
        schema
          .isTrue(
            i18n_claimForm.t(
              'payment.payment_method.acknowledge_direct_deposit_option.errors.mustBeTrue'
            )
          )
          .required(
            i18n_claimForm.t(
              'payment.payment_method.acknowledge_direct_deposit_option.errors.required'
            )
          ),
    }),
    federal_income_tax_withheld: boolean()
      .nullable()
      .required(
        i18n_claimForm.t('payment.federal_income_tax_withheld.errors.required')
      ),
    apply_for_increased_payment_for_dependents: boolean()
      .nullable()
      .required(
        i18n_claimForm.t(
          'payment.apply_for_increased_payment_for_dependents.errors.required'
        )
      ),
  }),
}
