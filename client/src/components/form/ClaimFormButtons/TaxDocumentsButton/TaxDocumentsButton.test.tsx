import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes } from 'constants/routes'
import { TaxDocumentsButton } from './TaxDocumentsButton'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

const mockNavigateTaxDocuments = jest.fn()
mockRouter.mockImplementation(() => ({
  push: mockNavigateTaxDocuments,
}))

describe('Tax Documents button', () => {
  const renderButton = () => {
    render(<TaxDocumentsButton />)
    const taxDocumentsButton = screen.queryByRole('button', {
      name: 'tax_doc_button',
    })
    return { taxDocumentsButton }
  }
  it('renders and takes the user to the tax form page', async () => {
    const user = userEvent.setup()

    const mockNavigateTaxDocuments = jest.fn()
    mockRouter.mockImplementation(() => ({
      push: mockNavigateTaxDocuments,
    }))

    const { taxDocumentsButton } = renderButton()

    await user.click(taxDocumentsButton as HTMLElement)
    expect(taxDocumentsButton).toBeInTheDocument()
    expect(mockNavigateTaxDocuments).toHaveBeenCalledTimes(1)
    expect(mockNavigateTaxDocuments).toHaveBeenCalledWith(Routes.TAX_DOCUMENTS)
  })
})
