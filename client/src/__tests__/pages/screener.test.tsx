import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import userEvent from '@testing-library/user-event'

import Screener from 'pages/screener'
import { noop } from 'helpers/noop/noop'

describe('Screener page', () => {
  const initialValues = {
    screener_current_country_us: undefined,
    screener_live_in_canada: undefined,
    screener_job_last_eighteen_months: undefined,
    screener_all_work_nj: undefined,
    screener_any_work_nj: undefined,
    screener_currently_disabled: undefined,
    screener_military_service_eighteen_months: undefined,
    screener_maritime_employer_eighteen_months: undefined,
  }

  it('renders properly', () => {
    Screener.getLayout
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <Screener />
      </Formik>
    )

    expect(
      screen.getByText('screener_current_country_us.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_military_service_eighteen_months.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_job_last_eighteen_months.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_currently_disabled.label')
    ).toBeInTheDocument()

    expect(
      screen.getByText('screener_maritime_employer_eighteen_months.label')
    ).toBeInTheDocument()
  })

  it('Can fill out all questions on page', async () => {
    const user = userEvent.setup()
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Screener />
      </Formik>
    )

    expect(
      screen.getByText('screener_current_country_us.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_live_in_canada.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_live_in_canada.label' })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_military_service_eighteen_months.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_military_service_eighteen_months.label',
        })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_job_last_eighteen_months.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_job_last_eighteen_months.label',
        })
      ).getByLabelText('yes')
    )

    expect(screen.getByText('screener_all_work_nj.label')).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_all_work_nj.label' })
      ).getByLabelText('no')
    )

    expect(screen.getByText('screener_any_work_nj.label')).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_any_work_nj.label',
        })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_currently_disabled.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_currently_disabled.label',
        })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_maritime_employer_eighteen_months.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_maritime_employer_eighteen_months.label',
        })
      ).getByLabelText('no')
    )
  })

  it('Tests if Canada question clears', async () => {
    const user = userEvent.setup()
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Screener />
      </Formik>
    )

    expect(
      screen.getByText('screener_current_country_us.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('no')
    )

    expect(
      screen.getByText('screener_live_in_canada.label')
    ).toBeInTheDocument()
    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_live_in_canada.label' })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('no')
    )

    expect(screen.getByText('screener_live_in_canada.label')).not.toBeChecked()
  })

  it('Tests if Any and All Work in NJ questions clear', async () => {
    const user = userEvent.setup()
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Screener />
      </Formik>
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_current_country_us.label' })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_military_service_eighteen_months.label',
        })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_job_last_eighteen_months.label',
        })
      ).getByLabelText('yes')
    )

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_all_work_nj.label' })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_any_work_nj.label',
        })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_job_last_eighteen_months.label',
        })
      ).getByLabelText('no')
    )

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'screener_job_last_eighteen_months.label',
        })
      ).getByLabelText('yes')
    )

    expect(screen.getByText('screener_all_work_nj.label')).not.toBeChecked()

    await user.click(
      within(
        screen.getByRole('group', { name: 'screener_all_work_nj.label' })
      ).getByLabelText('no')
    )

    expect(screen.getByText('screener_any_work_nj.label')).not.toBeChecked()
  })
})
