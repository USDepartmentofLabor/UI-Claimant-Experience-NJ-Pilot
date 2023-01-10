import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewEmployersNextButton } from 'components/form/ClaimFormButtons/ReviewEmployerNextButton/ReviewEmployersNextButton'

const mockSubmitForm = jest.fn(() => Promise.resolve())
const mockUseFormikContext = jest.fn()
jest.mock('formik', () => ({
  useFormikContext: () => mockUseFormikContext(),
}))

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('NextButton', () => {
  afterEach(() => {
    mockSubmitForm.mockClear()
    mockPush.mockClear()
  })

  it('renders properly', () => {
    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      submitForm: mockSubmitForm,
    })

    render(<ReviewEmployersNextButton type="add" />)

    const button = screen.queryByRole('button', {
      name: 'review_employers.add',
    })

    expect(button).toBeInTheDocument()
  })

  it('disables when submitting', () => {
    mockUseFormikContext.mockReturnValue({
      isSubmitting: true,
      isValid: true,
      submitForm: mockSubmitForm,
    })
    render(<ReviewEmployersNextButton type="add" />)

    const button = screen.getByRole('button', { name: 'review_employers.add' })

    expect(button).toBeDisabled()
  })

  it('submits the form on click and then navigates to the next page', async () => {
    const mockSetSubmitting = jest.fn()
    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      setSubmitting: mockSetSubmitting,
      submitForm: mockSubmitForm,
    })

    const mockEvent = jest.fn()

    const user = userEvent.setup()

    render(<ReviewEmployersNextButton onClick={mockEvent} type="add" />)

    const button = screen.getByRole('button', { name: 'review_employers.add' })

    await user.click(button)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockSetSubmitting).toHaveBeenCalledTimes(2)
    expect(mockSetSubmitting).toHaveBeenCalledWith(true)
    expect(mockSetSubmitting).toHaveBeenCalledWith(false)
    expect(mockEvent).toHaveBeenCalledTimes(1)
  })

  it('does not navigate to the next page if the form is invalid', async () => {
    const mockSetSubmitting = jest.fn()
    mockUseFormikContext.mockReturnValue({
      isValid: false,
      isSubmitting: false,
      setSubmitting: mockSetSubmitting,
      submitForm: mockSubmitForm,
    })

    const mockEvent = jest.fn()
    const user = userEvent.setup()

    render(<ReviewEmployersNextButton onClick={mockEvent} type="edit" />)

    const button = screen.getByRole('button', { name: 'review_employers.save' })

    await user.click(button)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockSetSubmitting).toHaveBeenCalledTimes(0)
  })
})
