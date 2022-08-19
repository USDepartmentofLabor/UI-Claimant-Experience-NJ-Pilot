import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { Union } from 'pages/claim/union'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'

describe('Union page', () => {
  beforeEach(() => {
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <Union />
      </Formik>
    )
  })

  it('renders', async () => {
    expect(
      screen.queryByText('required_to_seek_work_through_hiring_hall.label')
    ).toBeInTheDocument()
  })

  it('toggles fields conditionally', async () => {
    const user = userEvent.setup()

    const seekWorkThroughHiringHall = screen.getByRole('group', {
      name: 'required_to_seek_work_through_hiring_hall.label',
    })
    const yesSeekWork = within(seekWorkThroughHiringHall).getByRole('radio', {
      name: 'yes',
    })
    const noSeekWork = within(seekWorkThroughHiringHall).getByRole('radio', {
      name: 'no',
    })

    const queryForUnionName = () =>
      screen.queryByLabelText('union_name.label', {
        exact: false,
      })
    const queryForUnionLocalNumber = () =>
      screen.queryByLabelText('union_local_number.label', {
        exact: false,
      })

    expect(queryForUnionName()).not.toBeInTheDocument()
    expect(queryForUnionLocalNumber()).not.toBeInTheDocument()

    await user.click(yesSeekWork)

    expect(queryForUnionName()).toBeInTheDocument()
    expect(queryForUnionLocalNumber()).toBeInTheDocument()

    await user.click(noSeekWork)

    expect(queryForUnionName()).not.toBeInTheDocument()
    expect(queryForUnionLocalNumber()).not.toBeInTheDocument()
  })
})
