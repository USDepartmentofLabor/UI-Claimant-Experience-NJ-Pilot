import React from 'react'

import { YourEmployer } from './YourEmployer'
import { render } from '@testing-library/react'

import { useField, useFormikContext } from 'formik' // package will be auto mocked
jest.mock('formik')
const mockUseField = useField as typeof useField & jest.Mock
const mockUseFormikContext = useFormikContext as typeof useFormikContext &
  jest.Mock

const employerIndex = '1'

describe('Your Employer component', () => {
  beforeEach(() => {
    mockUseFormikContext.mockReturnValue({ submitCount: 0 })

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
      name: 'employers[1].is_full_time',
    }
    mockUseField.mockReturnValue([mockField, mockMeta])
  })

  it('renders labels and radio buttons', () => {
    const { container } = render(
      <YourEmployer index={employerIndex}></YourEmployer>
    )
    expect(container.getElementsByClassName('usa-radio__input').length).toBe(2)
    expect(container.getElementsByClassName('usa-hint').length).toBe(1)
    expect(container.getElementsByTagName('legend').length).toBe(2)
  })
})
