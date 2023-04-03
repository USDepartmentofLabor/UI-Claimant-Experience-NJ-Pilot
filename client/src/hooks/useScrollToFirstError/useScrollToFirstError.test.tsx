import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, Formik } from 'formik'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import TextField from 'components/form/fields/TextField/TextField'
import { ErrorScroller } from './useScrollToFirstError'

const scrollIntoViewMock = jest.fn()
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

describe('useScrollToFirstError', () => {
  const renderScrollToFirstError = (fieldName: string) =>
    render(
      <Formik
        onSubmit={jest.fn()}
        initialValues={{ firstName: '' }}
        validate={(values) => {
          const errors = { firstName: '' }
          if (!values?.firstName) errors.firstName = 'Required.'
          return errors
        }}
      >
        {({ errors, submitCount }) => {
          const showErrorSummary =
            submitCount > 0 && Object.keys(errors).length > 0
          return (
            <Form>
              {showErrorSummary && (
                <>
                  <ErrorScroller />
                  <FormErrorSummary key={submitCount} errors={errors} />
                </>
              )}
              <TextField label={'First name'} type="text" name={fieldName} />
              <button type="submit">Submit</button>
            </Form>
          )
        }}
      </Formik>
    )

  it('Does not scroll if there are no errors', () => {
    renderScrollToFirstError('firstName')
    expect(scrollIntoViewMock).not.toBeCalled()
  })

  it('Scrolls to input if there are errors', async () => {
    const user = userEvent.setup()
    renderScrollToFirstError('firstName')
    const submitButton = screen.getByRole('button', { name: 'Submit' })
    await user.click(submitButton)
    const errorSummary = await screen.findByTestId('form-error-summary')

    expect(errorSummary).toHaveTextContent('validation_alert')
    expect(scrollIntoViewMock).toHaveBeenCalled()
  })

  it('Does not scroll if there is no element found', async () => {
    scrollIntoViewMock.mockReset()
    const user = userEvent.setup()
    renderScrollToFirstError('wrongFieldName')
    const submitButton = screen.getByRole('button', { name: 'Submit' })
    await user.click(submitButton)

    expect(scrollIntoViewMock).not.toBeCalled()
  })
})
