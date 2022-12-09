import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { noop } from 'helpers/noop/noop'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Formik } from 'formik'

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockAppendAndSaveClaimFormValues = jest.fn(async () => Promise.resolve())
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    appendAndSaveClaimFormValues: mockAppendAndSaveClaimFormValues,
  }),
}))

describe('BackButton', () => {
  const previousPage = '/previous'

  it('Renders', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Formik initialValues={{}} validationSchema={{}} onSubmit={noop}>
          <BackButton previousPage={previousPage} onClick={noop} />
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
          <BackButton previousPage={previousPage} onClick={onClick} />
        </Formik>
      </QueryClientProvider>
    )

    const previousPageButton = screen.getByText('pagination.previous')

    await userEvent.click(previousPageButton)

    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith(values)

    expect(onClick).toHaveBeenCalledTimes(1)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(previousPage)
  })
})
