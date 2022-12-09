import { render, screen } from '@testing-library/react'
import { ScreenerLayout } from 'components/layouts/ScreenerLayout/ScreenerLayout'
import { makeClaimFormRoute } from 'constants/routes'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))

describe('ScreenerLayout Layout', () => {
  const SomePage = () => <div>Some Page!</div>

  it('render properly', async () => {
    mockRouter.mockImplementation(() => ({
      pathname: makeClaimFormRoute('some'),
    }))
    render(
      <ScreenerLayout>
        <SomePage />
      </ScreenerLayout>
    )

    const children = await screen.findByText('Some Page!')
    const heading = screen.queryByText('heading')

    expect(children).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
  })
})
