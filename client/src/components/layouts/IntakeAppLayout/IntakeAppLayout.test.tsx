import { render, screen } from '@testing-library/react'
import { IntakeAppLayout } from 'components/layouts/IntakeAppLayout/IntakeAppLayout'
import { makeClaimFormRoute } from 'constants/routes'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

describe('IntakeAppLayout Layout', () => {
  const SomePage = () => <div>Some Page!</div>

  it('render properly', async () => {
    mockRouter.mockImplementation(() => ({
      pathname: makeClaimFormRoute('some'),
    }))

    const heading = 'Fancy heading'
    render(
      <IntakeAppLayout heading={heading}>
        <SomePage />
      </IntakeAppLayout>
    )

    const children = await screen.findByText('Some Page!')

    expect(children).toBeInTheDocument()
    expect(screen.getByText(heading)).toBeInTheDocument()
  })
})
