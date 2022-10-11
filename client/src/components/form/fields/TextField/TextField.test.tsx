import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useField, useFormikContext } from 'formik' // package will be auto mocked
import userEvent from '@testing-library/user-event'

import TextField from 'components/form/fields/TextField/TextField'

// mock out formik hook as we are not testing formik
// needs to be before first describe
jest.mock('formik')
const mockUseField = useField as typeof useField & jest.Mock
const mockUseFormikContext = useFormikContext as typeof useFormikContext &
  jest.Mock

describe('TextField component', () => {
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

    render(<TextField name="firstName" label="First Name" type="text" />)

    expect(screen.queryByText('First Name')).toBeInstanceOf(HTMLLabelElement)
    expect(screen.queryByLabelText('First Name')).toBeInstanceOf(
      HTMLInputElement
    )
    expect(screen.queryByLabelText('First Name')).toHaveAttribute(
      'name',
      'firstName'
    )
    expect(screen.queryByLabelText('First Name')).toHaveAttribute(
      'id',
      'firstName'
    )
  })

  it('calls a custom onBlur function passed in', async () => {
    const user = userEvent.setup()
    const onBlur = jest.fn()
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
      onBlur: onBlur,
      multiple: undefined,
      name: 'firstName',
    }

    mockUseField.mockReturnValue([mockField, mockMeta])

    render(<TextField name="firstName" label="First Name" type="text" />)

    const textField = screen.getByLabelText('First Name')

    // Focus then blur the text field
    await user.click(textField)
    fireEvent.blur(textField)

    expect(onBlur).toHaveBeenCalledTimes(1)
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

    render(
      <TextField
        name="firstName"
        className="myCustomInputClass"
        label="First Name"
        type="text"
      />
    )

    expect(screen.queryByLabelText('First Name')).toHaveClass(
      'myCustomInputClass'
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

      render(<TextField name="firstName" label="First Name" type="text" />)

      expect(screen.queryByText('First Name')).not.toHaveClass(
        'usa-label--error'
      )
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument()
    })

    it('shows the error message if the form is submitted', () => {
      const mockMeta = {
        touched: true,
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

      mockUseFormikContext.mockReturnValue({ submitCount: 1 })
      mockUseField.mockReturnValue([mockField, mockMeta])

      render(<TextField name="firstName" label="First Name" type="text" />)

      expect(screen.queryByText('First Name')).toHaveClass('usa-label--error')
      expect(screen.queryByText('This field is required')).toBeInTheDocument()
    })
  })

  describe('error styling', () => {
    beforeEach(() => {
      mockUseFormikContext.mockReturnValue({ submitCount: 1 })
    })
    describe('without prefix or suffix', () => {
      it('shows appropriate error styling', async () => {
        const user = userEvent.setup()
        const mockMeta = {
          touched: true,
          error: "There's an error!",
          initialError: "There's an error!",
          initialTouched: true,
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

        render(<TextField name="firstName" label="First Name" type="text" />)

        const textField = screen.getByLabelText('First Name')

        expect(textField).toHaveClass('usa-input--error')

        await user.click(textField)
        expect(textField).toHaveFocus()
        expect(textField).not.toHaveClass('usa-input--error')
      })
    })
    describe('with prefix or suffix', () => {
      it.each([{ inputPrefix: 'SomePrefix' }, { inputSuffix: 'SomeSuffix' }])(
        'shows appropriate error styling with prefix',
        async (prefixOrSuffixProp) => {
          const user = userEvent.setup()
          const mockMeta = {
            touched: true,
            error: "There's an error!",
            initialError: "There's an error!",
            initialTouched: true,
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

          render(
            <TextField
              name="firstName"
              label="First Name"
              type="text"
              {...prefixOrSuffixProp}
            />
          )

          const inputGroup = screen.getByTestId('firstName-input-group')
          const textField = screen.getByLabelText('First Name')

          expect(inputGroup).toHaveClass('usa-input-group--error')

          await user.click(textField)
          expect(textField).toHaveFocus()
          expect(inputGroup).not.toHaveClass('usa-input-group--error')
          expect(inputGroup).toHaveClass('is-focused')
        }
      )
    })
  })

  afterEach(jest.resetAllMocks)
})
