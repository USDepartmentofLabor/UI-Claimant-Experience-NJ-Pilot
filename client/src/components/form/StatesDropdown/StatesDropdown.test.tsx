import { render, screen, within } from '@testing-library/react'
import { statesAndTerritories } from 'fixtures/states_and_territories'
import { StateAbbrev, StatesDropdown } from './StatesDropdown'
import { Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'

describe('StatesDropdown Component', () => {
  it('renders properly', () => {
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <StatesDropdown name={'test-name'} label={'test-label'} startEmpty />
      </Formik>
    )

    const statesDropdown = screen.getByLabelText('test-label')
    expect(statesDropdown.children.length).toBe(
      Object.keys(statesAndTerritories).length + 1
    )
  })

  it('renders a state slice', () => {
    const stateSlice: StateAbbrev[] = ['GA', 'CA']

    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <StatesDropdown
          name={'test-name'}
          label={'test-label'}
          startEmpty
          stateSlice={stateSlice}
        />
      </Formik>
    )

    const statesDropdown = screen.getByLabelText('test-label')
    expect(statesDropdown.children.length).toBe(stateSlice.length + 1)
    expect(within(statesDropdown).queryByText('Georgia')).toBeInTheDocument()
    expect(within(statesDropdown).queryByText('California')).toBeInTheDocument()
  })

  it('takes an onChange handler and runs it on change', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <StatesDropdown
          name={'test-name'}
          label={'test-label'}
          startEmpty
          onChange={onChange}
        />
      </Formik>
    )

    const statesDropdown = screen.getByLabelText('test-label')

    await user.selectOptions(statesDropdown, 'GA')

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
