import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentInformation from 'pages/claim/payment'
import { Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import { accountTypeOptions, paymentMethodOptions } from 'constants/formOptions'

describe('Payment page', () => {
  it('renders as expected', () => {
    const initialValues = {
      payment_method: {},
    }
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <PaymentInformation />
      </Formik>
    )
    paymentMethodOptions.forEach((option) => {
      const paymentMethodRadio = screen.getByRole('radio', {
        name: `payment_method.options.${option}`,
      })
      expect(paymentMethodRadio).not.toBeChecked()
    })
    ;['yes', 'no'].forEach((option) => {
      const federalTaxWithheldRadio = screen.getByTestId(
        `federal_income_tax_withheld.${option}`
      )
      expect(federalTaxWithheldRadio).not.toBeChecked()
    })
    ;['yes', 'no'].forEach((option) => {
      const dependencyBenefitsRadio = screen.getByTestId(
        `apply_for_increased_payment_for_dependents.${option}`
      )
      expect(dependencyBenefitsRadio).not.toBeChecked()
    })
  })

  it('shows fields conditional upon direct deposit selection', async () => {
    const user = userEvent.setup()
    const initialValues = {
      payment_method: {},
    }
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <PaymentInformation />
      </Formik>
    )

    await user.click(
      screen.getByRole('radio', {
        name: 'payment_method.options.direct_deposit',
      })
    )

    accountTypeOptions.forEach((option) => {
      const accountTypeRadio = screen.getByRole('radio', {
        name: `account_type.options.${option}`,
      })
      expect(accountTypeRadio).not.toBeChecked()

      expect(screen.getByLabelText('routing_number.label')).toBeInTheDocument()
      expect(
        screen.getByLabelText('re_enter_routing_number.label')
      ).toBeInTheDocument()
      expect(screen.getByLabelText('account_number.label')).toBeInTheDocument()
      expect(
        screen.getByLabelText('re_enter_account_number.label')
      ).toBeInTheDocument()
      expect(
        screen.getByLabelText(
          'payment_method.acknowledge_direct_deposit_option.label'
        )
      ).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText('routing_number.label'), '012345678')
    await user.type(
      screen.getByLabelText('re_enter_routing_number.label'),
      '012345678'
    )
    await user.type(
      screen.getByLabelText('account_number.label'),
      '01234567890123'
    )
    await user.type(
      screen.getByLabelText('re_enter_account_number.label'),
      '01234567890123'
    )
    await user.click(
      screen.getByRole('checkbox', {
        name: 'payment_method.acknowledge_direct_deposit_option.label',
      })
    )

    // check that values get cleared when debit is chosen
    await user.click(
      screen.getByRole('radio', {
        name: 'payment_method.options.debit',
      })
    )
    await user.click(
      screen.getByRole('radio', {
        name: 'payment_method.options.direct_deposit',
      })
    )
    expect(
      screen.getByRole('group', { name: 'account_type.label' })
    ).toHaveFormValues({})
    expect(
      screen.getByRole('textbox', { name: 'routing_number.label' })
    ).toHaveValue('')
    expect(
      screen.getByRole('textbox', { name: 're_enter_routing_number.label' })
    ).toHaveValue('')
    expect(
      screen.getByRole('textbox', { name: 'account_number.label' })
    ).toHaveValue('')
    expect(
      screen.getByRole('textbox', { name: 're_enter_account_number.label' })
    ).toHaveValue('')
    expect(
      screen.getByRole('checkbox', {
        name: 'payment_method.acknowledge_direct_deposit_option.label',
      })
    ).not.toBeChecked()
  })
})
