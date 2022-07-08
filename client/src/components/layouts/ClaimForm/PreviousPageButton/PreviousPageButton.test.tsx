import { PreviousPageButton } from 'components/layouts/ClaimForm/PreviousPageButton/PreviousPageButton'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { noop } from 'helpers/noop/noop'

describe('PreviousPageButton', () => {
  it('Renders', () => {
    render(<PreviousPageButton onClick={noop} />)

    const previousPageButton = screen.queryByText('pagination.previous')

    expect(previousPageButton).toBeInTheDocument()
  })

  it('Accepts an onClick param', async () => {
    const onClick = jest.fn()
    render(<PreviousPageButton onClick={onClick} />)

    const previousPageButton = screen.getByText('pagination.previous')

    await userEvent.click(previousPageButton)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
