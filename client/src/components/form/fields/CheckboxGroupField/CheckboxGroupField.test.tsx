import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'

import { CheckboxGroupField } from 'components/form/fields/CheckboxGroupField/CheckboxGroupField'
import { noop } from 'helpers/noop/noop'
import React from 'react'

const checkboxOptions = [
  {
    label: 'First',
    value: 'first',
  },
  {
    label: 'Second',
    value: 'second',
  },
  {
    label: 'Third',
    value: 'third',
  },
]

describe('CheckboxGroupField component', () => {
  it('renders the elements that make up the field', () => {
    const legend = 'What is the question?'
    const { getByLabelText } = render(
      <Formik initialValues={{ checkboxGroupField: [] }} onSubmit={noop}>
        <CheckboxGroupField
          legend={legend}
          name="checkboxGroupField"
          options={checkboxOptions}
        />
      </Formik>
    )

    const firstOption = getByLabelText('First')
    const secondOption = getByLabelText('Second')
    const thirdOption = getByLabelText('Third')

    expect(screen.getByText(legend)).toBeInTheDocument()
    expect(firstOption).toBeInstanceOf(HTMLInputElement)
    expect(firstOption).toHaveAttribute('id', 'checkboxGroupField.first')
    expect(firstOption).toHaveAttribute('name', 'checkboxGroupField')
    expect(firstOption).toHaveAttribute('value', 'first')

    expect(secondOption).toBeInstanceOf(HTMLInputElement)
    expect(secondOption).toHaveAttribute('id', 'checkboxGroupField.second')
    expect(secondOption).toHaveAttribute('name', 'checkboxGroupField')
    expect(secondOption).toHaveAttribute('value', 'second')

    expect(thirdOption).toBeInstanceOf(HTMLInputElement)
    expect(thirdOption).toHaveAttribute('id', 'checkboxGroupField.third')
    expect(thirdOption).toHaveAttribute('name', 'checkboxGroupField')
    expect(thirdOption).toHaveAttribute('value', 'third')
  })

  describe('uses initial values', () => {
    it('uses the initial value that is passed', () => {
      const { getByLabelText } = render(
        <Formik
          initialValues={{ checkboxGroupField: ['first', 'third'] }}
          onSubmit={noop}
        >
          <CheckboxGroupField
            legend="What is the question?"
            name="checkboxGroupField"
            options={checkboxOptions}
          />
        </Formik>
      )

      const firstOption = getByLabelText('First')
      const secondOption = getByLabelText('Second')
      const thirdOption = getByLabelText('Third')

      expect(firstOption).toBeChecked()
      expect(secondOption).not.toBeChecked()
      expect(thirdOption).toBeChecked()
    })
  })

  describe('disabled', () => {
    it.todo('disables the all checkboxes in the group when it is disabled')

    it('is possible to disable a subset of checkbox options', () => {
      const { getByLabelText } = render(
        <Formik initialValues={{ checkboxGroupField: [] }} onSubmit={noop}>
          <CheckboxGroupField
            legend="What is the question?"
            name="checkboxGroupField"
            options={checkboxOptions.map((option) => ({
              label: option.label,
              value: option.value,
              checkboxProps: {
                disabled: option.value === checkboxOptions[1].value,
              },
            }))}
          />
        </Formik>
      )

      const firstOption = getByLabelText('First')
      const secondOption = getByLabelText('Second')
      const thirdOption = getByLabelText('Third')

      expect(firstOption).not.toBeDisabled()
      expect(secondOption).toBeDisabled()
      expect(thirdOption).not.toBeDisabled()
    })
  })

  describe('user interaction', () => {
    it('allows the user to make a single selection', async () => {
      const { getByLabelText } = render(
        <Formik initialValues={{ checkboxGroupField: [] }} onSubmit={noop}>
          <CheckboxGroupField
            legend="What is the question?"
            name="checkboxGroupField"
            options={checkboxOptions}
          />
        </Formik>
      )

      const firstOption = getByLabelText('First')
      const secondOption = getByLabelText('Second')
      const thirdOption = getByLabelText('Third')

      // Initially empty, no checkbox should be checked
      expect(firstOption).not.toBeChecked()
      expect(secondOption).not.toBeChecked()
      expect(thirdOption).not.toBeChecked()

      // Select an option
      await userEvent.click(thirdOption)

      // Only that option should be checked
      expect(firstOption).not.toBeChecked()
      expect(secondOption).not.toBeChecked()
      expect(thirdOption).toBeChecked()

      // Select a different option
      await userEvent.click(firstOption)

      // Both options should now be checked
      expect(firstOption).toBeChecked()
      expect(secondOption).not.toBeChecked()
      expect(thirdOption).toBeChecked()
    })
  })
  describe('on validation', () => {
    it('Prevents onInvalid default from showing default validation error', async () => {
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <CheckboxGroupField
            legend="Some Legend"
            name="someLegend"
            options={[{ label: 'something', value: 'some value' }]}
          />
        </Formik>
      )

      const testField = screen.getByRole('checkbox', { name: 'something' })
      const invalidEvent = createEvent.invalid(testField)
      fireEvent(testField, invalidEvent)
      expect(invalidEvent.defaultPrevented).toBeTruthy()
    })
  })
})
