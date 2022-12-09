import { SaveAndExitLink } from 'components/form/ClaimFormButtons/SaveAndExitLink/SaveAndExitLink'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { noop } from 'helpers/noop/noop'

describe('BackButton', () => {
  it('Renders', () => {
    render(<SaveAndExitLink onClick={noop} />)

    const saveAndExitLink = screen.queryByText('pagination.save_and_exit')

    expect(saveAndExitLink).toBeInTheDocument()
  })

  it('Accepts an onClick param', async () => {
    const onClick = jest.fn()
    render(<SaveAndExitLink onClick={onClick} />)

    const saveAndExitLink = screen.getByText('pagination.save_and_exit')

    await userEvent.click(saveAndExitLink)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
