import React from 'react'
import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { useField, useFormikContext } from 'formik' // package will be auto mocked

import TextAreaField from 'components/form/fields/TextAreaField/TextAreaField'

// mock out formik hook as we are not testing formik
// needs to be before first describe
jest.mock('formik')
const mockUseField = useField as typeof useField & jest.Mock
const mockUseFormikContext = useFormikContext as typeof useFormikContext &
  jest.Mock

describe('TextAreaField component', () => {
  beforeEach(() => {
    mockUseFormikContext.mockReturnValue({ submitCount: 0 })
  })

  it('renders the elements that make up a field', () => {
    const mockMeta = {
      touched: false,
      error: '',
      initialError: '',
      initialTouched: false,
      initialValue: '',
      value: '',
    }
    const mockField = {
      value: '',
      checked: false,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      multiple: undefined,
      name: 'firstName',
    }

    mockUseField.mockReturnValue([mockField, mockMeta])

    const { queryByText, queryByLabelText } = render(
      <TextAreaField name="firstName" label="First Name" />
    )

    expect(queryByText('First Name')).toBeInstanceOf(HTMLLabelElement)
    expect(queryByLabelText('First Name')).toBeInstanceOf(HTMLTextAreaElement)
    expect(queryByLabelText('First Name')).toHaveAttribute('name', 'firstName')
    expect(queryByLabelText('First Name')).toHaveAttribute('id', 'firstName')
  })

  it('passes a custom className prop to the input element', () => {
    const mockMeta = {
      touched: false,
      error: '',
      initialError: '',
      initialTouched: false,
      initialValue: '',
      value: '',
    }
    const mockField = {
      value: '',
      checked: false,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      multiple: undefined,
      name: 'firstName',
    }
    mockUseField.mockReturnValue([mockField, mockMeta])

    const { queryByLabelText } = render(
      <TextAreaField
        name="firstName"
        className="myCustomInputClass"
        label="First Name"
      />
    )

    expect(queryByLabelText('First Name')).toHaveClass('myCustomInputClass')
  })

  it('shows character counter', () => {
    const mockMeta = {
      touched: false,
      error: '',
      initialError: '',
      initialTouched: false,
      initialValue: '',
      value: '',
    }
    const mockField = {
      value: '',
      checked: false,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      multiple: undefined,
      name: 'firstName',
    }

    mockUseField.mockReturnValue([mockField, mockMeta])

    const { queryByTestId } = render(
      <TextAreaField name="firstName" characterLimit={10} label="First Name" />
    )

    expect(queryByTestId('characterCountMessage')?.textContent).toBe(
      '10 characters allowed'
    )
  })

  describe('with an error message', () => {
    it('does not show the error message if the input is untouched', () => {
      const mockMeta = {
        touched: false,
        error: 'This field is required',
        initialError: '',
        initialTouched: false,
        initialValue: '',
        value: '',
      }

      const mockField = {
        value: '',
        checked: false,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        multiple: undefined,
        name: 'firstName',
      }

      mockUseField.mockReturnValue([mockField, mockMeta])

      const { queryByText } = render(
        <TextAreaField name="firstName" label="First Name" />
      )
      expect(queryByText('First Name')).not.toHaveClass('usa-label--error')
      expect(queryByText('This field is required')).not.toBeInTheDocument()
    })

    it('shows the error message if the input has been submitted', () => {
      const mockMeta = {
        touched: true,
        submitCount: 1,
        error: 'This field is required',
        initialError: '',
        initialTouched: false,
        initialValue: '',
        value: '',
      }

      const mockField = {
        value: '',
        checked: false,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        multiple: undefined,
        name: 'firstName',
      }

      mockUseField.mockReturnValue([mockField, mockMeta])
      mockUseFormikContext.mockReturnValue({ submitCount: 1 })

      const { queryByText } = render(
        <TextAreaField name="firstName" label="First Name" />
      )

      expect(queryByText('First Name')).toHaveClass('usa-label--error')
      expect(queryByText('This field is required')).toBeInTheDocument()
    })
    it('Prevents onInvalid default from showing default validation error', async () => {
      const mockMeta = {
        touched: true,
        submitCount: 1,
        error: 'This field is required',
        initialError: '',
        initialTouched: false,
        initialValue: '',
        value: '',
      }

      const mockField = {
        value: '',
        checked: false,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        multiple: undefined,
        name: 'firstName',
      }

      mockUseField.mockReturnValue([mockField, mockMeta])
      mockUseFormikContext.mockReturnValue({ submitCount: 1 })

      render(<TextAreaField name="MyText" label="My Text" />)

      const testField = screen.getByRole('textbox', { name: /my text/i })
      const invalidEvent = createEvent.invalid(testField)
      fireEvent(testField, invalidEvent)
      expect(invalidEvent.defaultPrevented).toBeTruthy()
    })
  })

  afterEach(jest.resetAllMocks)
})
