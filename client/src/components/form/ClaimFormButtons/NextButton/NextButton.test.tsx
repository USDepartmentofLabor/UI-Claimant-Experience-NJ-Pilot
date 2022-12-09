import { render, screen } from '@testing-library/react'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import userEvent from '@testing-library/user-event'

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

    render(<NextButton nextPage="/some-page" />)

    const button = screen.queryByRole('button', { name: 'pagination.next' })

    expect(button).toBeInTheDocument()
  })

  it('disables when submitting', () => {
    mockUseFormikContext.mockReturnValue({
      isSubmitting: true,
      isValid: true,
      submitForm: mockSubmitForm,
    })
    render(<NextButton nextPage="/some-page" />)

    const button = screen.getByRole('button', { name: 'pagination.next' })

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

    const user = userEvent.setup()

    render(<NextButton nextPage="/some-page" />)

    const button = screen.getByRole('button', { name: 'pagination.next' })

    await user.click(button)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockSetSubmitting).toHaveBeenCalledTimes(2)
    expect(mockSetSubmitting).toHaveBeenCalledWith(true)
    expect(mockSetSubmitting).toHaveBeenCalledWith(false)
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/some-page')
  })

  it('accepts an onClick parameter that runs after the form is submitted', async () => {
    const mockSetSubmitting = jest.fn()
    mockUseFormikContext.mockReturnValue({
      isValid: true,
      isSubmitting: false,
      setSubmitting: mockSetSubmitting,
      submitForm: mockSubmitForm,
    })

    const user = userEvent.setup()

    const onClick = jest.fn()
    render(<NextButton onClick={onClick} nextPage="/some-page" />)

    const button = screen.getByRole('button', { name: 'pagination.next' })

    await user.click(button)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)

    expect(mockSetSubmitting).toHaveBeenCalledTimes(2)
    expect(mockSetSubmitting).toHaveBeenCalledWith(true)
    expect(mockSetSubmitting).toHaveBeenCalledWith(false)
    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/some-page')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not navigate to the next page if the form is invalid', async () => {
    mockUseFormikContext.mockReturnValue({
      isValid: false,
      isSubmitting: false,
      submitForm: mockSubmitForm,
    })

    const user = userEvent.setup()

    render(<NextButton nextPage="/some-page" />)

    const button = screen.getByRole('button', { name: 'pagination.next' })

    await user.click(button)

    expect(mockSubmitForm).toHaveBeenCalledTimes(1)
    expect(mockPush).not.toHaveBeenCalled()
  })
})
