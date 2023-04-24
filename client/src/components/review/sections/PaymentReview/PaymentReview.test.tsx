import { render, screen } from '@testing-library/react'
import { PaymentReview } from './PaymentReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { AccountTypeOption, PaymentMethodOption } from 'constants/formOptions'

describe('PaymentReview component', () => {
  const renderPaymentReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <PaymentReview />
      </ClaimFormContext.Provider>
    )

    const paymentMethod = screen.queryAllByRole('group', {
      name: 'payment.payment_method.label',
    })
    const accountType = screen.queryAllByRole('group', {
      name: 'payment.account_type.label',
    })
    const routingNumber = screen.queryAllByRole('group', {
      name: 'payment.routing_number.label',
    })
    const accountNumber = screen.queryAllByRole('group', {
      name: 'payment.account_number.label',
    })

    const acknowledgeDirectDeposit = screen.queryAllByRole('group', {
      name: 'payment.payment_method.acknowledge_direct_deposit_option.label',
    })
    const fedTaxWithheld = screen.queryAllByRole('group', {
      name: 'payment.federal_income_tax_withheld.label',
    })
    const paymentForDependents = screen.queryAllByRole('group', {
      name: 'payment.apply_for_increased_payment_for_dependents.label',
    })

    return {
      paymentMethod,
      accountType,
      routingNumber,
      accountNumber,
      acknowledgeDirectDeposit,
      fedTaxWithheld,
      paymentForDependents,
    }
  }

  it('renders correctly', () => {
    const values = {
      payment_method: 'direct_deposit' as PaymentMethodOption,
      account_type: 'savings' as AccountTypeOption,
      routing_number: '123456789',
      account_number: '123456789',
      acknowledge_direct_deposit_option: true,
      federal_income_tax_withheld: true,
      apply_for_increased_payment_for_dependents: true,
    }

    const {
      paymentMethod,
      accountType,
      routingNumber,
      accountNumber,
      acknowledgeDirectDeposit,
      fedTaxWithheld,
      paymentForDependents,
    } = renderPaymentReview(values)

    expect(paymentMethod[0]).toHaveTextContent('deposit')
    expect(accountType[0]).toHaveTextContent('savings')
    expect(routingNumber[0]).toHaveTextContent('•••••••••')
    expect(accountNumber[0]).toHaveTextContent('•••••••••')
    expect(acknowledgeDirectDeposit[0]).toHaveTextContent('yes')
    expect(fedTaxWithheld[0]).toHaveTextContent('yes')
    expect(paymentForDependents[0]).toHaveTextContent('yes')
  })

  it('does not render account and routing info if user answers "prepaid debit card" to payment type question', () => {
    const values = {
      payment_method: 'debit' as PaymentMethodOption,
      federal_income_tax_withheld: false,
      apply_for_increased_payment_for_dependents: false,
    }

    const {
      paymentMethod,
      accountType,
      routingNumber,
      accountNumber,
      acknowledgeDirectDeposit,
      fedTaxWithheld,
      paymentForDependents,
    } = renderPaymentReview(values)

    expect(paymentMethod[0]).toHaveTextContent('debit')
    expect(accountType.length).toBe(0)
    expect(routingNumber.length).toBe(0)
    expect(accountNumber.length).toBe(0)
    expect(acknowledgeDirectDeposit.length).toBe(0)
    expect(fedTaxWithheld[0]).toHaveTextContent('no')
    expect(paymentForDependents[0]).toHaveTextContent('no')
  })
})
