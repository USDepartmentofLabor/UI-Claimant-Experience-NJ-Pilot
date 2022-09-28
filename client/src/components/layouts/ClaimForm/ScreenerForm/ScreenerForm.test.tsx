import { render, screen } from '@testing-library/react'
import { ScreenerForm } from 'components/layouts/ClaimForm/ScreenerForm/ScreenerForm'
import { makeClaimFormRoute, Routes } from 'constants/routes'
import userEvent from '@testing-library/user-event'

const useRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => useRouter(),
}))
jest.mock('constants/pages/pageDefinitions')
jest.mock('pages/screener', () => ({
  ScreenerPageDefinition: {
    initialValues: {},
    validationSchema: undefined,
    heading: 'Test heading',
  },
}))

describe('ScreenerForm Layout', () => {
  const SomePage = () => <div>Some Page!</div>

  it('render properly with previous and next page buttons', async () => {
    useRouter.mockImplementation(() => ({
      pathname: makeClaimFormRoute('some'),
    }))
    render(
      <ScreenerForm>
        <SomePage />
      </ScreenerForm>
    )

    await screen.findByText('Some Page!')

    const previousButton = screen.queryByText('pagination.previous')
    const nextButton = screen.queryByText('pagination.next')

    expect(previousButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('clicking previous navigates to the previous page', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn(async () => true)
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }))

    render(
      <ScreenerForm>
        <SomePage />
      </ScreenerForm>
    )

    await screen.findByText('Some Page!')
    const previousButton = screen.getByText('pagination.previous')

    expect(previousButton).toBeInTheDocument()

    await user.click(previousButton)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(Routes.HOME)
  })

  it('clicking next navigates to the next page', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn(async () => true)
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }))

    render(
      <ScreenerForm>
        <SomePage />
      </ScreenerForm>
    )

    await screen.findByText('Some Page!')

    const nextButton = screen.getByText('pagination.next')

    expect(nextButton).toBeInTheDocument()

    await user.click(nextButton)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(Routes.HOME)
  })
})
