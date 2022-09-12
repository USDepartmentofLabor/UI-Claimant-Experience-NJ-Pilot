import { render, screen } from '@testing-library/react'
import { ClaimFormSideNav } from './ClaimFormSideNav'
import { makeClaimFormRoute } from 'constants/routes'
import { noop } from 'helpers/noop/noop'
import { Formik } from 'formik'

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
})
