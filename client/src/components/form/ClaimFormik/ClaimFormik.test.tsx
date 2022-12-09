import { render, screen } from '@testing-library/react'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ClaimantInput } from 'types/claimantInput'
import userEvent from '@testing-library/user-event'
import { object, string } from 'yup'
import TextField from 'components/form/fields/TextField/TextField'

jest.mock('hooks/useInitialValues', () => ({
  useInitialValues: (values: ClaimantInput) => ({
    initialValues: values,
    isLoading: false,
  }),
}))

const mockAppendAndSaveClaimFormValues = jest.fn(() => Promise.resolve())
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    appendAndSaveClaimFormValues: mockAppendAndSaveClaimFormValues,
  }),
}))

const mockCognitoSignOut = jest.fn(() => Promise.resolve())
jest.mock('utils/signout/cognitoSignOut', () => ({
  cognitoSignOut: () => mockCognitoSignOut(),
}))

describe('ClaimFormik component', () => {
  afterEach(() => {
    mockAppendAndSaveClaimFormValues.mockClear()
    mockCognitoSignOut.mockClear()
  })

  it('renders properly passing in child components', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ClaimFormik initialValues={{}} validationSchema={{}}>
          <div>children</div>
        </ClaimFormik>
      </QueryClientProvider>
    )

    const children = screen.queryByText('children')
    const saveAndExitButton = screen.queryByTestId('save-and-exit-button')

    expect(children).toBeInTheDocument()
    expect(saveAndExitButton).toBeInTheDocument()
  })

  it('renders properly providing context via a child function', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ClaimFormik
          initialValues={{ someKey: 'someValue' }}
          validationSchema={{}}
        >
          {({ values }) => {
            return (
              <>
                <div>children</div>
                <div>{values.someKey}</div>
              </>
            )
          }}
        </ClaimFormik>
      </QueryClientProvider>
    )

    const children = screen.queryByText('children')
    const formikValue = screen.queryByText('someValue')
    const saveAndExitButton = screen.queryByTestId('save-and-exit-button')

    expect(children).toBeInTheDocument()
    expect(saveAndExitButton).toBeInTheDocument()
    expect(formikValue).toBeInTheDocument()
  })

  it('handles saving and exiting the form', async () => {
    const user = userEvent.setup()

    const values = { someKey: 'someValue' }

    render(
      <QueryClientProvider client={new QueryClient()}>
        <ClaimFormik initialValues={values} validationSchema={{}}>
          <div>children</div>
        </ClaimFormik>
      </QueryClientProvider>
    )

    const saveAndExitButton = screen.getByTestId('save-and-exit-button')

    await user.click(saveAndExitButton)

    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith(values)
    expect(mockCognitoSignOut).toHaveBeenCalledTimes(1)
  })

  it('handles submitting the form', async () => {
    const user = userEvent.setup()

    const values = { someKey: 'someValue' }
    const validationSchema = object().shape({
      someKey: string().required(),
    })

    render(
      <QueryClientProvider client={new QueryClient()}>
        <ClaimFormik initialValues={values} validationSchema={validationSchema}>
          <button type="submit">Submit</button>
        </ClaimFormik>
      </QueryClientProvider>
    )

    const submitButton = screen.getByRole('button', { name: 'Submit' })

    await user.click(submitButton)

    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith(values)
  })

  it('shows an error summary', async () => {
    const user = userEvent.setup()

    const values = { someKey: undefined }
    const validationSchema = object().shape({
      someKey: string().required('someKey is required'),
    })

    render(
      <QueryClientProvider client={new QueryClient()}>
        <ClaimFormik initialValues={values} validationSchema={validationSchema}>
          <TextField label="Some Key" name="someKey" type="text" />
          <button type="submit">Submit</button>
        </ClaimFormik>
      </QueryClientProvider>
    )

    const submitButton = screen.getByRole('button', { name: 'Submit' })

    await user.click(submitButton)

    expect(mockAppendAndSaveClaimFormValues).not.toHaveBeenCalled()

    const errorSummary = await screen.findByTestId('form-error-summary')
    const errorMessage = screen.getByTestId('errorMessage')

    expect(errorSummary).toHaveTextContent('validation_alert')
    expect(errorMessage).toHaveTextContent('someKey is required')
  })
})
