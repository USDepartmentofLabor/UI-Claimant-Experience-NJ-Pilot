import React from 'react'
import { render, within } from '@testing-library/react'
import { Formik } from 'formik'

import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { noop } from 'helpers/noop/noop'

describe('dropdownField component', () => {
  it('renders the elements that make up a field', () => {
    const { getByText, getByLabelText } = render(
      <Formik initialValues={{}} onSubmit={noop}>
        <DropdownField
          name="dropdownField"
          label="dropdownField"
          options={[
            { label: 'label1', value: 'value1' },
            { label: 'label2', value: 'value2' },
          ]}
        />
      </Formik>
    )

    expect(getByText('dropdownField')).toBeInstanceOf(HTMLLabelElement)
    expect(getByLabelText('dropdownField')).toHaveAttribute(
      'name',
      'dropdownField'
    )
    expect(getByLabelText('dropdownField')).toHaveAttribute(
      'id',
      'dropdownField'
    )
  })

  it('renders optgroup and sub element', () => {
    const { getAllByRole, getByRole } = render(
      <Formik initialValues={{}} onSubmit={noop}>
        <DropdownField
          name="dropdownField"
          label="dropdownField"
          options={{ 'US States': [{ label: 'New Jersey', value: 'NJ' }] }}
        />
      </Formik>
    )
    expect(getAllByRole('option').length).toBe(1)
    const optgroup = getByRole('group', { name: /US States/i })
    expect(optgroup).toBeInstanceOf(HTMLOptGroupElement)
    const option = within(optgroup).getByText('New Jersey')
    expect(option).toBeInstanceOf(HTMLOptionElement)
  })

  describe('uses initial values', () => {
    it('uses the initial value that is passed', () => {
      const initialValues = {
        dropdownField: 'value2',
      }

      const { getByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <DropdownField
            name="dropdownField"
            label="dropdownField"
            options={[
              { label: 'label1', value: 'value1' },
              { label: 'label2', value: 'value2' },
            ]}
          />
        </Formik>
      )
      expect(getByLabelText('dropdownField')).toHaveValue('value2')
    })
  })

  describe('disabled', () => {
    it('disables the dropdown when it is disabled', () => {
      const { getByLabelText } = render(
        <Formik initialValues={{}} onSubmit={noop}>
          <DropdownField
            name="dropdownField"
            label="dropdownField"
            options={[
              { label: 'label1', value: 'value1' },
              { label: 'label2', value: 'value2' },
            ]}
            disabled
          />
        </Formik>
      )

      expect(getByLabelText('dropdownField')).toBeDisabled()
    })
  })
})
