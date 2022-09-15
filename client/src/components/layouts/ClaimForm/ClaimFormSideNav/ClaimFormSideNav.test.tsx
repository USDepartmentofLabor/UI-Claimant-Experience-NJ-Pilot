import { render, screen } from '@testing-library/react'
import { ClaimFormSideNav } from './ClaimFormSideNav'
import { makeClaimFormRoute } from 'constants/routes'
import { noop } from 'helpers/noop/noop'
import { Formik } from 'formik'
import userEvent from '@testing-library/user-event'

jest.mock('constants/pages/pageDefinitions')

const useRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => useRouter(),
}))

describe('ClaimFormSideNav', () => {
  it('renders properly', async () => {
    useRouter.mockImplementation(() => ({
      pathname: makeClaimFormRoute('first'),
    }))
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <ClaimFormSideNav />
      </Formik>
    )

    const claimFormPageHeading = screen.queryByText('First page')

    expect(claimFormPageHeading).toBeInTheDocument()
  })
  it('should throw an error when current form page does not exist', async () => {
    useRouter.mockImplementation(() => ({
      pathname: makeClaimFormRoute('fakepage'),
    }))

    expect(() =>
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <ClaimFormSideNav />
        </Formik>
      )
    ).toThrow('Page not found')
  })

  it('pushes the link in the page definition and formik state when a link is pressed', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn(async () => true)
    useRouter.mockImplementation(() => ({
      pathname: makeClaimFormRoute('middle'),
      push: mockPush,
    }))
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <ClaimFormSideNav />
      </Formik>
    )

    const firstPage = screen.getByText('First page')

    await user.click(firstPage)

    expect(mockPush).toHaveBeenCalledTimes(1)
  })
})
