import { PaymentButton } from './PaymentButton'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes } from 'constants/routes'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

const mockNavigateUpdatePayment = jest.fn()
mockRouter.mockImplementation(() => ({
  push: mockNavigateUpdatePayment,
}))

describe('payment button', () => {
  const renderButton = () => {
    render(<PaymentButton />)
    const updatePaymentButton = screen.queryByRole('button', {
      name: 'update_payment_button',
    })
    return { updatePaymentButton }
  }
  it('renders and takes the user to the update payment form page', async () => {
    const user = userEvent.setup()
    const { updatePaymentButton } = renderButton()

    await user.click(updatePaymentButton as HTMLElement)

    expect(updatePaymentButton).toBeInTheDocument()
    expect(mockNavigateUpdatePayment).toHaveBeenCalledTimes(1)
    expect(mockNavigateUpdatePayment).toHaveBeenCalledWith(
      Routes.UPDATE_PAYMENT_INFO
    )
  })
})
