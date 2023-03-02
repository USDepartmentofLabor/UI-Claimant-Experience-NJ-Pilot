import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes } from 'constants/routes'
import { UpdateContactButton } from './UpdateContactButton'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

const mockNavigateUpdateContact = jest.fn()
mockRouter.mockImplementation(() => ({
  push: mockNavigateUpdateContact,
}))

describe('payment button', () => {
  const renderButton = () => {
    render(<UpdateContactButton />)
    const updateContactInfoButton = screen.queryByRole('button', {
      name: 'update_contact_info_button',
    })
    return { updateContactInfoButton }
  }
  it('renders and takes the user to the update contact info form page', async () => {
    const user = userEvent.setup()

    const mockNavigateUpdateContact = jest.fn()
    mockRouter.mockImplementation(() => ({
      push: mockNavigateUpdateContact,
    }))

    const { updateContactInfoButton } = renderButton()

    await user.click(updateContactInfoButton as HTMLElement)

    expect(updateContactInfoButton).toBeInTheDocument()
    expect(mockNavigateUpdateContact).toHaveBeenCalledTimes(1)
    expect(mockNavigateUpdateContact).toHaveBeenCalledWith(
      Routes.UPDATE_CONTACT_INFO
    )
  })
})
