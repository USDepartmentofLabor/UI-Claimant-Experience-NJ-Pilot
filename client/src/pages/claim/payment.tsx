import { useTranslation } from 'react-i18next'
import { Accordion, Fieldset, Link } from '@trussworks/react-uswds'

import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { TextField } from 'components/form/fields/TextField/TextField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import {
  accountTypeOptions,
  paymentMethodOptions,
  UNTOUCHED_CHECKBOX_VALUE,
  UNTOUCHED_RADIO_VALUE,
} from 'constants/formOptions'
import { PaymentInput } from 'types/claimantInput'
import { Trans } from 'next-i18next'
import { AccordionItemProps } from '@trussworks/react-uswds/lib/components/Accordion/Accordion'
import routing_and_account_numbers from 'assets/img/routing_and_account_numbers.gif'
import CheckboxField from 'components/form/fields/CheckboxField/CheckboxField'
import { NextPageWithLayout } from 'pages/_app'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { PaymentPageDefinition } from 'constants/pages/definitions/paymentPageDefinition'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { ReactNode, ChangeEventHandler, useEffect, useState } from 'react'

const pageDefinition = PaymentPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const pageInitialValues = {
  payment_method: UNTOUCHED_RADIO_VALUE,
  account_type: UNTOUCHED_RADIO_VALUE,
  routing_number: '',
  LOCAL_re_enter_routing_number: '',
  account_number: '',
  LOCAL_re_enter_account_number: '',
  acknowledge_direct_deposit_option: UNTOUCHED_CHECKBOX_VALUE,
  federal_income_tax_withheld: UNTOUCHED_RADIO_VALUE,
  apply_for_increased_payment_for_dependents: UNTOUCHED_RADIO_VALUE,
}

const PaymentInformation: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'payment',
  })

  return (
    <ClaimFormik<PaymentInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values, clearFields }) => {
        const showDepositFields = values.payment_method === 'direct_deposit'
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
              {
                <Trans
                  t={t}
                  i18nKey="routing_and_account_number.description.line2"
                />
              }
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

        const handlePaymentMethodChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'debit') {
            await clearFields({
              account_type: pageInitialValues.account_type,
              routing_number: pageInitialValues.routing_number,
              LOCAL_re_enter_routing_number:
                pageInitialValues.LOCAL_re_enter_routing_number,
              account_number: pageInitialValues.account_number,
              LOCAL_re_enter_account_number:
                pageInitialValues.LOCAL_re_enter_account_number,
              acknowledge_direct_deposit_option:
                pageInitialValues.acknowledge_direct_deposit_option,
            })
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
              <RadioField
                name="payment_method"
                legend={t('payment_method.label')}
                options={paymentMethodOptions.map((option) => {
                  return {
                    label: t(`payment_method.options.${option}`),
                    value: option,
                  }
                })}
                onChange={handlePaymentMethodChange}
              />

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
                          <Trans
                            t={t}
                            i18nKey="routing_and_account_number.label"
                          />
                        }
                      >
                        <aside>{routingAndAccountNumberHelp()}</aside>
                      </Fieldset>
                    </>
                  )}
                </div>

                <CheckboxField
                  name="acknowledge_direct_deposit_option"
                  label={t(
                    'payment_method.acknowledge_direct_deposit_option.label'
                  )}
                />
              </>
            )}

            <Fieldset
              legend={
                <Trans t={t} i18nKey="federal_income_tax_withheld.header" />
              }
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
                    Learn more about eligibility requirements here
                  </Link>
                </Trans>
              </p>
              {t(
                'apply_for_increased_payment_for_dependents.description.line2'
              )}
              <YesNoQuestion
                question={t('apply_for_increased_payment_for_dependents.label')}
                name="apply_for_increased_payment_for_dependents"
              />
            </Fieldset>
            <ClaimFormButtons nextStep={nextPage.heading}>
              <BackButton previousPage={previousPage.path} />
              <NextButton nextPage={nextPage.path} />
            </ClaimFormButtons>
          </>
        )
      }}
    </ClaimFormik>
  )
}

PaymentInformation.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default PaymentInformation
