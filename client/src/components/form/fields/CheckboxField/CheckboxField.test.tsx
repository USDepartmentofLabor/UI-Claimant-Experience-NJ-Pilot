import React from 'react'
import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { Formik } from 'formik'

import { CheckboxField } from 'components/form/fields/CheckboxField/CheckboxField'
import { noop } from 'helpers/noop/noop'

describe('CheckboxField component', () => {
  it('renders the elements that make up a field', () => {
    const { getByText, getByLabelText } = render(
      <Formik initialValues={{}} onSubmit={noop}>
        <CheckboxField name="checkboxField" label="checkboxField" />
      </Formik>
    )

    expect(getByText('checkboxField')).toBeInstanceOf(HTMLLabelElement)
    expect(getByLabelText('checkboxField')).toHaveAttribute(
      'name',
      'checkboxField'
    )
    expect(getByLabelText('checkboxField')).toHaveAttribute(
      'id',
      'checkboxField'
    )
  })

  describe('uses initial values', () => {
    it('uses the initial value that is passed', () => {
      const initialValues = {
        checkboxField: true,
      }

      const { getByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <CheckboxField name="checkboxField" label="checked" />
        </Formik>
      )
      expect(getByLabelText('checked')).toBeChecked()
    })
  })

  describe('disabled', () => {
    it('disables the checkbox when it is disabled', () => {
      const { getByLabelText } = render(
        <Formik initialValues={{}} onSubmit={noop}>
          <CheckboxField name="checkboxField" label="checkboxField" disabled />
        </Formik>
      )

      expect(getByLabelText('checkboxField')).toBeDisabled()
    })
  })
  describe('on validation', () => {
    it('Prevents onInvalid default from showing default validation error', async () => {
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <CheckboxField label="Some Key" name="someKey" type="text" />
        </Formik>
      )

      const testTextField = screen.getByLabelText(/some key/i)
      const invalidEvent = createEvent.invalid(testTextField)
      fireEvent(testTextField, invalidEvent)
      expect(invalidEvent.defaultPrevented).toBeTruthy()
    })
  })

  afterEach(jest.resetAllMocks)
})
