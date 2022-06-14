import React from 'react'
import { Formik } from 'formik'
import { render } from '@testing-library/react'
import { DatePicker } from 'components/form/fields/DatePicker/DatePicker'
import { noop } from 'helpers/noop/noop'

describe('DatePicker', () => {
  it('renders', () => {
    const { getByTestId } = render(
      <Formik initialValues={{ dateName: undefined }} onSubmit={noop}>
        <DatePicker name="dateName" label="title" />
      </Formik>
    )
    const visibleDateField = getByTestId('date-picker-external-input')
    expect(visibleDateField).toBeInstanceOf(HTMLInputElement)
    expect(visibleDateField).toHaveAttribute('id', 'dateName')

    const hiddenDateField = getByTestId('date-picker-internal-input')
    expect(hiddenDateField).toHaveAttribute('name', 'dateName')
  })

  afterEach(jest.resetAllMocks)
})
