import { Formik } from 'formik'
import { render, screen } from '@testing-library/react'

import { YesNoQuestion } from './YesNoQuestion'
import userEvent from '@testing-library/user-event'
import { noop } from 'helpers/noop/noop'
import { boolean, object } from 'yup'

describe('YesNoQuestion Component', () => {
  it('renders properly', () => {
    render(
      <Formik
        initialValues={{
          my_yes_no_button: undefined,
        }}
        onSubmit={noop}
      >
        <YesNoQuestion question="yes or no?" name="my_yes_no_button" />
      </Formik>
    )

    const yes = screen.getByLabelText('yes')
    const no = screen.getByLabelText('no')

    expect(yes).not.toBeChecked()
    expect(yes.parentElement).toHaveClass('inline')
    expect(no).not.toBeChecked()
    expect(no.parentElement).toHaveClass('inline')
  })

  it('Only Yes or No may be selected at a time', async () => {
    const user = userEvent.setup()
    render(
      <Formik
        initialValues={{
          my_yes_no_button: undefined,
        }}
        onSubmit={noop}
      >
        <YesNoQuestion question="yes or no?" name="my_yes_no_button" />
      </Formik>
    )

    const yes = screen.getByLabelText('yes')
    const no = screen.getByLabelText('no')

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
    render(
      <Formik
        initialValues={{
          my_yes_no_button: true,
        }}
        onSubmit={noop}
      >
        <YesNoQuestion question="yes or no?" name="my_yes_no_button" />
      </Formik>
    )

    const yes = screen.getByLabelText('yes')
    const no = screen.getByLabelText('no')

    expect(yes).toBeChecked()
    expect(no).not.toBeChecked()
  })

  it('Accepts an onChange handler', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(
      <Formik
        initialValues={{
          my_yes_no_button: true,
        }}
        onSubmit={noop}
      >
        <YesNoQuestion
          question="yes or no?"
          name="my_yes_no_button"
          onChange={onChange}
        />
      </Formik>
    )

    const yes = screen.getByLabelText('yes')
    const no = screen.getByLabelText('no')

    expect(yes).toBeChecked()
    expect(no).not.toBeChecked()

    await user.click(no)

    expect(yes).not.toBeChecked()
    expect(no).toBeChecked()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('shows errors', async () => {
    const user = userEvent.setup()

    render(
      <Formik
        initialValues={{
          my_yes_no_button: undefined,
        }}
        validationSchema={object().shape({
          my_yes_no_button: boolean().required(),
        })}
        onSubmit={noop}
      >
        {({ submitForm }) => (
          <>
            <YesNoQuestion question="yes or no?" name="my_yes_no_button" />
            <button type="submit" onClick={submitForm}>
              Submit
            </button>
          </>
        )}
      </Formik>
    )

    const submitButton = screen.getByRole('button')

    await user.click(submitButton)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
