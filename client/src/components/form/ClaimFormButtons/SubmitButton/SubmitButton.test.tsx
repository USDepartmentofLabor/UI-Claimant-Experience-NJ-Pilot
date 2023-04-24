import { render, screen } from '@testing-library/react'
import { SubmitButton } from 'components/form/ClaimFormButtons/SubmitButton/SubmitButton'
import userEvent from '@testing-library/user-event'

const mockSubmitForm = jest.fn(() => Promise.resolve())
const mockUseFormikContext = jest.fn()
jest.mock('formik', () => ({
  useFormikContext: () => mockUseFormikContext(),
}))

describe('SubmitButton', () => {
  afterEach(() => {
    mockSubmitForm.mockClear()
  })

  it('renders properly', () => {
    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      submitForm: mockSubmitForm,
    })

    render(<SubmitButton />)

    const button = screen.queryByRole('button', { name: 'pagination.submit' })

    expect(button).toBeInTheDocument()
  })

  it('disables when submitting', () => {
    mockUseFormikContext.mockReturnValue({
      isSubmitting: true,
      isValid: true,
      submitForm: mockSubmitForm,
    })
    render(<SubmitButton />)

    const button = screen.getByRole('button', { name: 'pagination.submit' })

    expect(button).toBeDisabled()
  })

  it('accepts an onClick parameter that runs after the form is submitted', async () => {
    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      submitForm: mockSubmitForm,
    })

    const user = userEvent.setup()

    const onClick = jest.fn()
    render(<SubmitButton onClick={onClick} />)

    const button = screen.getByRole('button', { name: 'pagination.submit' })

    await user.click(button)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('accepts and onSubmit parameter that runs if the formik submission is successful', async () => {
    const mockSetSubmitting = jest.fn()
    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      setSubmitting: mockSetSubmitting,
      submitForm: mockSubmitForm,
    })

    const user = userEvent.setup()

    const onSubmit = jest.fn()

    render(<SubmitButton onSubmit={onSubmit} />)

    const button = screen.getByRole('button', { name: 'pagination.submit' })

    await user.click(button)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockSetSubmitting).toHaveBeenCalledTimes(0) // Async submit handler manages submission state
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('onSubmit does not run if formik validation fails', async () => {
    mockUseFormikContext.mockReturnValue({
      isValid: false,
      isSubmitting: false,
      submitForm: mockSubmitForm,
    })

    const user = userEvent.setup()

    const onSubmit = jest.fn()

    render(<SubmitButton onSubmit={onSubmit} />)

    const button = screen.getByRole('button', { name: 'pagination.submit' })

    await user.click(button)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
