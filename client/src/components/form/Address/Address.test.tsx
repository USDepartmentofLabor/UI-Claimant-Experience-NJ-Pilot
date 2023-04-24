import { render, within } from '@testing-library/react'
import { Formik } from 'formik'

import { Address } from './Address'
import { noop } from 'helpers/noop/noop'
import { StateAbbrev } from '../StatesDropdown/StatesDropdown'

describe('Address component', () => {
  it('renders inputs for address with state slice', () => {
    const basename = 'claimant'
    const initialValues = {
      basename: {
        address: '',
        city: '',
        state: '',
        zipcode: '',
      },
    }
    const stateSlice: StateAbbrev[] = ['AL', 'WY']

    const { getByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Address basename={basename} stateSlice={stateSlice} />
      </Formik>
    )

    const addressField = getByLabelText('address.address.label')
    const cityField = getByLabelText('address.city.label')
    const stateField = getByLabelText('address.state.label')

    expect(addressField).toHaveValue('')
    expect(addressField).toHaveAttribute('id', `${basename}.address`)
    expect(addressField).toHaveAttribute('name', `${basename}.address`)

    expect(cityField).toHaveValue('')
    expect(cityField).toHaveAttribute('id', `${basename}.city`)
    expect(cityField).toHaveAttribute('name', `${basename}.city`)

    expect(stateField).toHaveValue('')
    expect(stateField).toHaveAttribute('id', `${basename}.state`)
    expect(stateField).toHaveAttribute('name', `${basename}.state`)
    expect(stateField.children.length).toBe(stateSlice.length + 1)
    expect(within(stateField).getByText('Alabama'))
    expect(within(stateField).getByText('Wyoming'))
  })

  it('renders all states by default', () => {
    const basename = 'claimant'
    const initialValues = {
      claimant: {
        address: '123 Main',
        city: 'Somewhere',
        state: 'TX',
        zipcode: '12345',
      },
    }

    const { getByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Address basename={basename} />
      </Formik>
    )

    const addressField = getByLabelText('address.address.label')
    const cityField = getByLabelText('address.city.label')
    const stateField = getByLabelText('address.state.label')

    expect(addressField).toHaveValue('123 Main')
    expect(cityField).toHaveValue('Somewhere')
    expect(stateField).toHaveValue('TX')
  })

  it('renders custom labels', () => {
    const basename = 'claimant'
    const initialValues = {
      claimant: {
        address: '123 Main',
        city: 'Somewhere',
        state: 'TX',
        zipcode: '12345',
      },
    }
    const myLabels = {
      address: 'first line',
      city: 'my city',
      state: 'your state',
      zipcode: 'POSTAL',
    }

    const { getByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Address basename={basename} labels={myLabels} />
      </Formik>
    )

    const addressField = getByLabelText('first line')
    const cityField = getByLabelText('my city')
    const stateField = getByLabelText('your state')
    const zipcodeField = getByLabelText('POSTAL')

    expect(addressField).toHaveValue('123 Main')
    expect(cityField).toHaveValue('Somewhere')
    expect(stateField).toHaveValue('TX')
    expect(zipcodeField).toHaveValue('12345')
  })
})
