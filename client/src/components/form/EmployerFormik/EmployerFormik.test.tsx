import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Employer, PaymentsReceivedDetailInput } from 'types/claimantInput'
import userEvent from '@testing-library/user-event'
import { object, string } from 'yup'
import { EmployerFormik } from 'components/form/EmployerFormik/EmployerFormik'
import { PayTypeOption } from 'constants/formOptions'
import TextField from 'components/form/fields/TextField/TextField'

const mockModifyEmployerAndSaveClaimFormValues = jest.fn(() =>
  Promise.resolve()
)
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    modifyEmployerAndSaveClaimFormValues:
      mockModifyEmployerAndSaveClaimFormValues,
  }),
}))

const mockCognitoSignOut = jest.fn(() => Promise.resolve())
jest.mock('utils/signout/cognitoSignOut', () => ({
  cognitoSignOut: () => mockCognitoSignOut(),
}))

describe('EmployerFormik component', () => {
  const values = {
    payments_received: [] as PaymentsReceivedDetailInput[],
    LOCAL_pay_types: [] as PayTypeOption[],
  }

  const renderEmployerFormik = (
    initialValues: Employer,
    validationSchema: any
  ) => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <EmployerFormik
          initialValues={initialValues}
          validationSchema={validationSchema}
          index={'0'}
          pageIndex={0}
          heading="test_heading"
        >
          <div>children</div>
          <TextField label="Some Key" name="someKey" type="text" />
          <button type="submit">Submit</button>
        </EmployerFormik>
      </QueryClientProvider>
    )

    const children = screen.queryByText('children')
    const saveAndExitButton = screen.queryByTestId('save-and-exit-button')
    const pageHeading = screen.queryByTestId('claim-form-page-heading')
    const headingText = screen.queryByText('test_heading')
    const submitButton = screen.getByRole('button', { name: 'Submit' })

    return {
      children,
      saveAndExitButton,
      submitButton,
      pageHeading,
      headingText,
    }
  }

  afterEach(() => {
    mockModifyEmployerAndSaveClaimFormValues.mockClear()
    mockCognitoSignOut.mockClear()
  })

  it('renders properly', () => {
    const { children, saveAndExitButton, pageHeading, headingText } =
      renderEmployerFormik(values, {})

    expect(children).toBeInTheDocument()
    expect(saveAndExitButton).toBeInTheDocument()
    expect(pageHeading).toBeInTheDocument()
    expect(headingText).toBeInTheDocument()
  })

  it('handles saving and exiting the form', async () => {
    const user = userEvent.setup()
    renderEmployerFormik(values, {})

    const saveAndExitButton = screen.getByTestId('save-and-exit-button')

    await user.click(saveAndExitButton)

    expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
      values,
      '0'
    )
    expect(mockCognitoSignOut).toHaveBeenCalledTimes(1)
  })

  it('handles submitting the form', async () => {
    const user = userEvent.setup()

    const localValues = { ...values, someKey: 'someValue' }
    const validationSchema = object().shape({
      someKey: string().required(),
    })
    const { submitButton } = renderEmployerFormik(localValues, validationSchema)

    await user.click(submitButton)

    expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
      localValues,
      '0'
    )
    expect(mockCognitoSignOut).toHaveBeenCalledTimes(0)
  })

  it('shows an error summary', async () => {
    const user = userEvent.setup()

    const localValues = { ...values, someKey: undefined }
    const validationSchema = object().shape({
      someKey: string().required('someKey is required'),
    })

    const { submitButton } = renderEmployerFormik(localValues, validationSchema)

    await user.click(submitButton)

    expect(mockModifyEmployerAndSaveClaimFormValues).not.toHaveBeenCalled()

    const errorSummary = await screen.findByTestId('form-error-summary')
    const errorMessage = await screen.getByTestId('errorMessage')

    expect(errorSummary).toHaveTextContent('validation_alert')
    expect(errorMessage).toHaveTextContent('someKey is required')
  })
})
