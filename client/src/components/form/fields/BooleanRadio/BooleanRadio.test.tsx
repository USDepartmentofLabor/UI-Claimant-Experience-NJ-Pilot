import { Formik } from 'formik'
import { act, render } from '@testing-library/react'

import { BooleanRadio } from './BooleanRadio'
import userEvent from '@testing-library/user-event'
import { noop } from 'helpers/noop/noop'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
}))

describe('BooleanRadio Component', () => {
  it('renders properly', () => {
    const { getByLabelText } = render(
      <Formik
        initialValues={{
          my_yes_no_button: undefined,
        }}
        onSubmit={noop}
      >
        <BooleanRadio name="my_yes_no_button" />
      </Formik>
    )

    const yes = getByLabelText('yes')
    const no = getByLabelText('no')

    expect(yes).not.toBeChecked()
    expect(yes.parentElement).toHaveClass('inline')
    expect(no).not.toBeChecked()
    expect(no.parentElement).toHaveClass('inline')
  })

  it('Only Yes or No may be selected at a time', async () => {
    const user = userEvent.setup()
    const { getByLabelText } = render(
      <Formik
        initialValues={{
          my_yes_no_button: undefined,
        }}
        onSubmit={noop}
      >
        <BooleanRadio name="my_yes_no_button" />
      </Formik>
    )

    const yes = getByLabelText('yes')
    const no = getByLabelText('no')

    expect(yes).not.toBeChecked()
    expect(no).not.toBeChecked()

    await user.click(no)

    expect(yes).not.toBeChecked()
    expect(no).toBeChecked()

    await user.click(yes)

    expect(yes).toBeChecked()
    expect(no).not.toBeChecked()
  })

  it('Accepts a default value', () => {
    const { getByLabelText } = render(
      <Formik
        initialValues={{
          my_yes_no_button: true,
        }}
        onSubmit={noop}
      >
        <BooleanRadio name="my_yes_no_button" />
      </Formik>
    )

    const yes = getByLabelText('yes')
    const no = getByLabelText('no')

    expect(yes).toBeChecked()
    expect(no).not.toBeChecked()
  })

  it('Accepts an onChange handler', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    const { getByLabelText } = render(
      <Formik
        initialValues={{
          my_yes_no_button: true,
        }}
        onSubmit={noop}
      >
        <BooleanRadio name="my_yes_no_button" onChange={onChange} />
      </Formik>
    )

    const yes = getByLabelText('yes')
    const no = getByLabelText('no')

    expect(yes).toBeChecked()
    expect(no).not.toBeChecked()

    await user.click(no)

    expect(yes).not.toBeChecked()
    expect(no).toBeChecked()
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
