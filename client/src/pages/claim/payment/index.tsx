import { NextPage } from 'next'

import { useTranslation } from 'react-i18next'
import { Fieldset } from '@trussworks/react-uswds'

import { RadioField } from '../../../components/form/fields/RadioField/RadioField'
import { TextField } from '../../../components/form/fields/TextField/TextField'
// import { IPageDefinition } from '../../PageDefinitions'
import { Formik } from 'formik'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import HelpText from 'components/HelpText/HelpText'
import { accountTypeOptions, paymentMethodOptions } from 'constants/formOptions'
import { noop } from 'helpers/noop/noop'

const PaymentInformation: NextPage = () => {
  // const { values, setFieldValue, setFieldTouched } =
  //   useFormikContext<ClaimantInput>()
  // const showDepositFields = values.payment?.payment_method === 'direct_deposit'
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'payment',
  })

  // useEffect(() => {
  //   if (values.payment?.payment_method === 'debit') {
  //     const accountFields = [
  //       'account_type',
  //       'routing_number',
  //       'LOCAL_re_enter_routing_number',
  //       'account_number',
  //       'LOCAL_re_enter_account_number',
  //     ]
  //
  //     accountFields.forEach((field) => {
  //       setFieldValue(`payment.${field}`, undefined)
  //       setFieldTouched(`payment.${field}`, false)
  //     })
  //   }
  // }, [values.payment?.payment_method])

  return (
    <Formik initialValues={{}} onSubmit={noop}>
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
        {/*{showDepositFields && (*/}
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
        {/*)}*/}
      </>
    </Formik>
  )
}

// const pageSchema = (t: TFunction<'claimForm'>) =>
//   yup.object().shape({
//     federal_income_tax_withheld: yup
//       .mixed()
//       .oneOf([true, false])
//       .required(t('payment.federal_income_tax_withheld.errors.required')),
//     payment: yup.object().shape({
//       payment_method: yup
//         .mixed()
//         .oneOf(paymentMethodOptions)
//         .required(t('payment.payment_method.errors.required')),
//       account_type: yup
//         .mixed()
//         .oneOf(accountTypeOptions)
//         .when('payment_method', {
//           is: 'direct_deposit',
//           then: yup.mixed().required(t('payment.account_type.errors.required')),
//         }),
//       routing_number: yup.mixed().when('payment_method', {
//         is: 'direct_deposit',
//         then: yup.mixed().required(t('payment.routing_number.errors.required')),
//       }),
//       LOCAL_re_enter_routing_number: yup.mixed().when('payment_method', {
//         is: 'direct_deposit',
//         then: yup
//           .mixed()
//           .oneOf(
//             [yup.ref('routing_number'), null],
//             t('payment.re_enter_routing_number.errors.mustMatch')
//           )
//           .required(t('payment.re_enter_routing_number.errors.required')),
//       }),
//       account_number: yup.mixed().when('payment_method', {
//         is: 'direct_deposit',
//         then: yup.mixed().required(t('payment.account_number.errors.required')),
//       }),
//       LOCAL_re_enter_account_number: yup.mixed().when('payment_method', {
//         is: 'direct_deposit',
//         then: yup
//           .mixed()
//           .oneOf(
//             [yup.ref('account_number'), null],
//             t('payment.re_enter_account_number.errors.mustMatch')
//           )
//           .required(t('payment.re_enter_account_number.errors.required')),
//       }),
//     }),
//   })

export default PaymentInformation

// export const PaymentInformationPage: IPageDefinition = {
//   path: 'payment',
//   heading: 'payment',
//   initialValues: { payment: {} },
//   Component: PaymentInformation,
//   pageSchema,
// } TODO: uncomment when claim wrapper implemented
