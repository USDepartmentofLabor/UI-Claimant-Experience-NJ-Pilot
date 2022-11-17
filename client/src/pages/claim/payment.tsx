import { NextPage } from 'next'

import { useTranslation } from 'react-i18next'
import { Accordion, Fieldset, Link } from '@trussworks/react-uswds'

import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { TextField } from 'components/form/fields/TextField/TextField'
import { useFormikContext } from 'formik'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { accountTypeOptions, paymentMethodOptions } from 'constants/formOptions'
import { ClaimantInput } from 'types/claimantInput'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
import { i18n_claimForm } from 'i18n/i18n'
import { boolean, object, ref, string } from 'yup'
import { Trans } from 'next-i18next'
import { AccordionItemProps } from '@trussworks/react-uswds/lib/components/Accordion/Accordion'
import routing_and_account_numbers from 'assets/img/routing_and_account_numbers.gif'
import { useClearFields } from 'hooks/useClearFields'
import CheckboxField from 'components/form/fields/CheckboxField/CheckboxField'
import { useEffect, useState } from 'react'

const PaymentInformation: NextPage = () => {
  const { values } = useFormikContext<ClaimantInput>()
  const showDepositFields = values.payment_method === 'direct_deposit'
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'payment',
  })
  const { clearFields } = useClearFields()

  const [width, setWidth] = useState<number>(window.innerWidth)

  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])
  const isMobile = width <= 768

  const routingAndAccountNumberHelp = () => {
    return (
      <>
        <img
          src={routing_and_account_numbers.src}
          alt={t('routing_and_account_number.image_alt')}
        />
        <p>
          {
            <Trans
              t={t}
              i18nKey="routing_and_account_number.description.line1"
            />
          }
        </p>
        {<Trans t={t} i18nKey="routing_and_account_number.description.line2" />}
        <p>{t('routing_and_account_number.description.line3')}</p>
      </>
    )
  }

  const routing_and_account_number_accordion: AccordionItemProps[] = [
    {
      title: <Trans t={t} i18nKey="routing_and_account_number.label" />,
      content: routingAndAccountNumberHelp(),
      expanded: false,
      id: 'routing_and_account_number',
      headingLevel: 'h4',
    },
  ]

  const handlePaymentMethodChange = () => {
    if (values.payment_method === 'debit') {
      clearFields([
        'account_type',
        'routing_number',
        'LOCAL_re_enter_routing_number',
        'account_number',
        'LOCAL_re_enter_account_number',
        'acknowledge_direct_deposit_option',
      ])
    }
  }

  return (
    <>
      <div>
        {t('header_description.line1')}
        <p>
          <Trans t={t} i18nKey="header_description.line2">
            <Link
              variant="external"
              href={
                'https://nj.gov/labor/myunemployment/before/about/payment/index.shtml/'
              }
            >
              payments information page
            </Link>
          </Trans>
        </p>
      </div>

      <Fieldset legend={<Trans t={t} i18nKey="payment_method.header" />}>
        <Fieldset legend={t('payment_method.label')}>
          <RadioField
            name="payment_method"
            options={paymentMethodOptions.map((option) => {
              return {
                label: t(`payment_method.options.${option}`),
                value: option,
              }
            })}
            onChange={handlePaymentMethodChange}
          />
        </Fieldset>
        {values.payment_method === 'direct_deposit' && (
          <p>{t('payment_method.direct_deposit_description')}</p>
        )}
        {values.payment_method === 'debit' && (
          <p>{t('payment_method.debit_card_description')}</p>
        )}
      </Fieldset>

      {showDepositFields && (
        <>
          <Fieldset legend={<Trans t={t} i18nKey="account_type.label" />}>
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

          <div>
            {isMobile && (
              <p>
                <Accordion
                  bordered={true}
                  items={routing_and_account_number_accordion}
                />
              </p>
            )}

            {!isMobile && (
              <>
                <p />
                <Fieldset
                  legend={
                    <Trans t={t} i18nKey="routing_and_account_number.label" />
                  }
                >
                  <aside>{routingAndAccountNumberHelp()}</aside>
                </Fieldset>
              </>
            )}
          </div>

          <CheckboxField
            name="acknowledge_direct_deposit_option"
            label={t('payment_method.acknowledge_direct_deposit_option.label')}
          />
        </>
      )}

      <Fieldset
        legend={<Trans t={t} i18nKey="federal_income_tax_withheld.header" />}
      >
        <p>{t('federal_income_tax_withheld.description')}</p>
        <YesNoQuestion
          question={t('federal_income_tax_withheld.label')}
          name="federal_income_tax_withheld"
          hint={t('federal_income_tax_withheld.help_text')}
        />
      </Fieldset>

      <Fieldset
        legend={
          <Trans
            t={t}
            i18nKey="apply_for_increased_payment_for_dependents.header"
          />
        }
      >
        <p>
          <Trans
            t={t}
            i18nKey="apply_for_increased_payment_for_dependents.description.line1"
          >
            <Link
              variant="external"
              href={
                'https://nj.gov/labor/myunemployment/before/about/howtoapply/dependencybenefits.shtml/'
              }
            >
              Learn more about eligibility here
            </Link>
          </Trans>
        </p>
        {t('apply_for_increased_payment_for_dependents.description.line2')}
        <YesNoQuestion
          question={t('apply_for_increased_payment_for_dependents.label')}
          name="apply_for_increased_payment_for_dependents"
        />
      </Fieldset>
    </>
  )
}

export const PaymentPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('payment.heading'),
  path: Routes.CLAIM.PAYMENT,
  initialValues: {
    federal_income_tax_withheld: undefined,
    payment_method: undefined,
    account_type: undefined,
    routing_number: undefined,
    LOCAL_re_enter_routing_number: undefined,
    account_number: undefined,
    LOCAL_re_enter_account_number: undefined,
    acknowledge_direct_deposit_option: undefined,
    apply_for_increased_payment_for_dependents: undefined,
  },
  validationSchema: object().shape({
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
    federal_income_tax_withheld: boolean().required(
      i18n_claimForm.t('payment.federal_income_tax_withheld.errors.required')
    ),
    apply_for_increased_payment_for_dependents: boolean().required(
      i18n_claimForm.t(
        'payment.apply_for_increased_payment_for_dependents.errors.required'
      )
    ),
  }),
}

export default PaymentInformation
