import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { noop } from 'helpers/noop/noop'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Formik } from 'formik'
import { EmployerBackButton } from 'components/form/ClaimFormButtons/EmployerBackButton/EmployerBackButton'

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockModifyEmployerAndSaveClaimFormValues = jest.fn(async () =>
  Promise.resolve()
)
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    modifyEmployerAndSaveClaimFormValues:
      mockModifyEmployerAndSaveClaimFormValues,
  }),
}))

describe('BackButton', () => {
  const previousPage = '/previous'
  const index = '0'

  it('Renders', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Formik initialValues={{}} validationSchema={{}} onSubmit={noop}>
          <EmployerBackButton
            index={index}
            previousPage={previousPage}
            onClick={noop}
          />
        </Formik>
      </QueryClientProvider>
    )

    const previousPageButton = screen.queryByText('pagination.previous')

    expect(previousPageButton).toBeInTheDocument()
  })

  it('Handles being clicked', async () => {
    const onClick = jest.fn()
    const values = { someKey: 'someValue' }
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Formik initialValues={values} validationSchema={{}} onSubmit={noop}>
          <EmployerBackButton
            index={index}
            previousPage={previousPage}
            onClick={onClick}
          />
        </Formik>
      </QueryClientProvider>
    )

    const previousPageButton = screen.getByText('pagination.previous')

    await userEvent.click(previousPageButton)

    expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
      values,
      index
    )

    expect(onClick).toHaveBeenCalledTimes(1)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(previousPage)
  })
})
