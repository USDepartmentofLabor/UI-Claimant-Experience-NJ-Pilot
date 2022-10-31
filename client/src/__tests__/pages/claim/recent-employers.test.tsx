import { noop } from 'helpers/noop/noop'
import { Formik } from 'formik'
import { screen, render, within } from '@testing-library/react'
import RecentEmployers from '../../../pages/claim/recent-employers'
import userEvent from '@testing-library/user-event'

describe('Recent employers page', () => {
  it('renders properly without error', async () => {
    render(
      <Formik onSubmit={noop} initialValues={{}}>
        <RecentEmployers />
      </Formik>
    )
    expect(screen.getByText('recent_employers.preamble')).toBeInTheDocument()
    expect(screen.getByText('recent_employers.question')).toBeInTheDocument()

    expect(screen.getByText('Lenox Incorporated')).toBeInTheDocument()
    expect(screen.getByText('Lyft Inc.')).toBeInTheDocument()
    expect(screen.getByText("McDonald's")).toBeInTheDocument()

    //const employer = screen.getByText(/did you work at lenox incorporated/i)
    const employer = await screen
      .findAllByRole('group', {
        name: /recent_employers.work_at/,
      })
      .then((value) => value[0])
    expect(employer).toBeInTheDocument()

    expect(within(employer).queryByLabelText('yes')).toBeInTheDocument()
    expect(within(employer).queryByLabelText('no')).toBeInTheDocument()
  })

  it('displays an alert when user selects that they did not work for an employer', async () => {
    render(
      <Formik onSubmit={noop} initialValues={{}}>
        <RecentEmployers />
      </Formik>
    )
    const user = userEvent.setup()
    expect(
      screen.queryByText('recent_employers.confirm_employer')
    ).not.toBeInTheDocument()

    const employerOne = await screen
      .findAllByRole('group', {
        name: /recent_employers.work_at/,
      })
      .then((value) => value[0])
    const employerOneRadioNo = within(employerOne).getByLabelText('no')
    await user.click(employerOneRadioNo)
    expect(employerOneRadioNo).toBeChecked()

    expect(
      screen.queryByText('recent_employers.confirm_employer')
    ).toBeInTheDocument()
  })
})
