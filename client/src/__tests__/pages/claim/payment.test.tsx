import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentInformation from 'pages/claim/payment'
import { accountTypeOptions, paymentMethodOptions } from 'constants/formOptions'
import { PaymentPageDefinition } from 'constants/pages/definitions/paymentPageDefinition'
import { QueryClient, QueryClientProvider } from 'react-query'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Payment page', () => {
  it('renders as expected', () => {
    render(<PaymentInformation />)
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

    render(<PaymentInformation />)

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

  describe('Validation Schema', () => {
    describe('account_type', () => {
      it('is required when payment_method is direct_deposit', async () => {
        const schemaSlice = {
          payment_method: 'direct_deposit',
          account_type: undefined,
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `account_type`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })
    describe('routing_number', () => {
      it('is required when payment_method is direct_deposit', async () => {
        const schemaSlice = {
          payment_method: 'direct_deposit',
          routing_number: undefined,
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `routing_number`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })
    describe('LOCAL_re_enter_routing_number', () => {
      it('is required when payment_method is direct_deposit', async () => {
        const schemaSlice = {
          payment_method: 'direct_deposit',
          routing_number: undefined,
          LOCAL_re_enter_routing_number: undefined,
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `LOCAL_re_enter_routing_number`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
      it('must match routing_number', async () => {
        const schemaSlice = {
          payment_method: 'direct_deposit',
          routing_number: '123456789',
          LOCAL_re_enter_routing_number: '987654321',
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `LOCAL_re_enter_routing_number`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
      it('passes validation when it matches routing_number', async () => {
        const value = '123456789'
        const schemaSlice = {
          payment_method: 'direct_deposit',
          routing_number: value,
          LOCAL_re_enter_routing_number: value,
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `LOCAL_re_enter_routing_number`,
            schemaSlice
          )
        ).resolves.toEqual(value)
      })
    })
    describe('account_number', () => {
      it('is required when payment_method is direct_deposit', async () => {
        const schemaSlice = {
          payment_method: 'direct_deposit',
          account_number: undefined,
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `account_number`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })
    describe('LOCAL_re_enter_account_number', () => {
      it('is required when payment_method is direct_deposit', async () => {
        const schemaSlice = {
          payment_method: 'direct_deposit',
          account_number: undefined,
          LOCAL_re_enter_account_number: undefined,
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `LOCAL_re_enter_account_number`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
      it('must match account_number', async () => {
        const schemaSlice = {
          payment_method: 'direct_deposit',
          account_number: '12345678901234567',
          LOCAL_re_enter_account_number: '76543210987654321',
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `LOCAL_re_enter_account_number`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
      it('passes validation when it matches routing_number', async () => {
        const value = '12345678901234567'
        const schemaSlice = {
          payment_method: 'direct_deposit',
          account_number: value,
          LOCAL_re_enter_account_number: value,
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `LOCAL_re_enter_account_number`,
            schemaSlice
          )
        ).resolves.toEqual(value)
      })
    })
    describe('acknowledge_direct_deposit_option', () => {
      it('is required when payment_method is direct_deposit', async () => {
        const schemaSlice = {
          payment_method: 'direct_deposit',
          acknowledge_direct_deposit_option: undefined,
        }

        await expect(
          PaymentPageDefinition.validationSchema.validateAt(
            `acknowledge_direct_deposit_option`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = PaymentInformation
      expect(Page).toHaveProperty('getLayout')

      render(
        <QueryClientProvider client={new QueryClient()}>
          {Page.getLayout?.(<Page />)}
        </QueryClientProvider>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
