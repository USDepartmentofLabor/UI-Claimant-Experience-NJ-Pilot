import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { Prequal } from 'pages/claim/prequal'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'

describe('Prequal page', () => {
  beforeEach(() => {
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <Prequal />
      </Formik>
    )
  })

  it('renders as expected', async () => {
    expect(screen.getByText('filed_in_last_12mo.label')).toBeInTheDocument()

    expect(
      screen.getByText('lived_outside_nj_when_working_nj.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('can_begin_work_immediately.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('federal_work_in_last_18mo.label')
    ).toBeInTheDocument()
  })

  it('check clear state, province, and territory dropdown', async () => {
    const user = userEvent.setup()

    await user.click(
      within(
        screen.getByRole('group', { name: 'filed_in_last_12mo.label' })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('state_province_territory_where_filed.label')
    ).toBeInTheDocument()

    await user.click(
      within(
        screen.getByRole('group', { name: 'filed_in_last_12mo.label' })
      ).getByLabelText('no')
    )
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'filed_in_last_12mo.label',
        })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('state_province_territory_where_filed.label')
    ).toBeInTheDocument()
  })

  it('check clear "will look for work in NJ"', async () => {
    const user = userEvent.setup()

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'lived_outside_nj_when_working_nj.label',
        })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('will_look_for_work_in_nj.label')
    ).toBeInTheDocument()

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'lived_outside_nj_when_working_nj.label',
        })
      ).getByLabelText('no')
    )
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'lived_outside_nj_when_working_nj.label',
        })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('will_look_for_work_in_nj.label')
    ).toBeInTheDocument()
  })

  it('can fill out all questions on page', async () => {
    const user = userEvent.setup()

    await user.click(
      within(
        screen.getByRole('group', { name: 'filed_in_last_12mo.label' })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('state_province_territory_where_filed.label')
    ).toBeInTheDocument()

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'lived_outside_nj_when_working_nj.label',
        })
      ).getByLabelText('yes')
    )
    expect(
      screen.getByText('will_look_for_work_in_nj.label')
    ).toBeInTheDocument()

    await user.click(
      within(
        screen.getByRole('group', { name: 'will_look_for_work_in_nj.label' })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'can_begin_work_immediately.label' })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'federal_work_in_last_18mo.label' })
      ).getByLabelText('yes')
    )
  })
})
