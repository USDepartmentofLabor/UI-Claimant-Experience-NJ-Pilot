import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes } from 'constants/routes'
import {
  ExternalWebsiteButton,
  ExternalWebsiteOption,
} from './ExternalWebsiteButton'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

const mockNavigateToWebsite = jest.fn()
mockRouter.mockImplementation(() => ({
  push: mockNavigateToWebsite,
}))

describe('Tax Documents button', () => {
  afterEach(() => {
    mockRouter.mockClear()
    mockNavigateToWebsite.mockClear()
  })

  const renderButton = (option: ExternalWebsiteOption) => {
    render(<ExternalWebsiteButton option={option} />)
    const externalButton = screen.queryAllByRole('button')[0]

    return { externalButton }
  }
  it('renders and takes the user to the tax form page', async () => {
    const user = userEvent.setup()

    const { externalButton } = renderButton('tax')

    expect(externalButton).toBeInTheDocument()
    await user.click(externalButton as HTMLElement)

    expect(mockNavigateToWebsite).toHaveBeenCalledTimes(1)
    expect(mockNavigateToWebsite).toHaveBeenCalledWith(Routes.TAX_DOCUMENTS)
    expect(externalButton).toHaveTextContent('tax_doc_button')
  })

  it('takes the user to the update contact info page', async () => {
    const user = userEvent.setup()

    const { externalButton } = renderButton('contact')
    await user.click(externalButton as HTMLElement)

    expect(mockNavigateToWebsite).toHaveBeenCalledTimes(1)
    expect(mockNavigateToWebsite).toHaveBeenCalledWith(
      Routes.UPDATE_CONTACT_INFO
    )
    expect(externalButton).toHaveTextContent('update_contact_info_button')
  })

  it('takes the user to the update payment info page', async () => {
    const user = userEvent.setup()

    const { externalButton } = renderButton('payment')
    await user.click(externalButton as HTMLElement)

    expect(mockNavigateToWebsite).toHaveBeenCalledTimes(1)
    expect(mockNavigateToWebsite).toHaveBeenCalledWith(
      Routes.UPDATE_PAYMENT_INFO
    )
    expect(externalButton).toHaveTextContent('update_payment_button')
  })
})
