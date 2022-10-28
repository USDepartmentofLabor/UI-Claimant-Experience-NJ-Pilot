import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'

import { noop } from 'helpers/noop/noop'
import ScreenerRedirect from 'pages/screener-redirect'

describe('Screener-redirect page', () => {
  it('renders properly', () => {
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <ScreenerRedirect />
      </Formik>
    )

    expect(
      screen.getByRole('heading', { name: 'page_title' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'info_alert.title' })
    ).toBeInTheDocument()
  })
  describe('shows the correct content based on querystring values', () => {
    const makeQueryString = (
      values: { [s: string]: unknown } | ArrayLike<unknown>
    ) => {
      return Object.entries(values)
        .filter(([, val]) => val !== undefined)
        .map(([key, val]) => `${key}=${val}`)
        .join('&')
    }

    const makeMockWindowSearch = (
      searchString: { [s: string]: unknown } | ArrayLike<unknown>
    ) => {
      const queryString = makeQueryString(searchString)
      Object.defineProperty(window, 'location', {
        value: {
          search: `?${queryString}`,
        },
      })
    }

    it.skip('when resident of Canada', () => {
      const searchString = {
        screener_current_country_us: false,
        screener_live_in_canada: true,
      }
      makeMockWindowSearch(searchString)

      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <ScreenerRedirect />
        </Formik>
      )

      expect(screen.getByText('canada.heading')).toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()
    })
    it.skip('when not a resident of US or Canada', () => {
      const searchString = {
        screener_current_country_us: false,
        screener_live_in_canada: false,
      }

      makeMockWindowSearch(searchString)

      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <ScreenerRedirect />
        </Formik>
      )
      expect(screen.getByText('non_resident.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()
    })
    it('when needing to file in another state', () => {
      const searchString = {
        screener_any_work_nj: false,
      }
      makeMockWindowSearch(searchString)

      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <ScreenerRedirect />
        </Formik>
      )

      expect(screen.getByText('other_state.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()
    })
    it.skip('when on disability', () => {
      const searchString = {
        screener_currently_disabled: true,
      }

      makeMockWindowSearch(searchString)

      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <ScreenerRedirect />
        </Formik>
      )

      expect(screen.getByText('disability.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()
    })
    it.skip('when worked in the military', () => {
      const searchString = {
        screener_military_service_eighteen_months: true,
      }

      makeMockWindowSearch(searchString)

      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <ScreenerRedirect />
        </Formik>
      )
      expect(screen.getByText('military_mvp.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()
    })
    it.skip('when had maritime employment', () => {
      const searchString = {
        screener_maritime_employer_eighteen_months: true,
      }

      makeMockWindowSearch(searchString)

      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <ScreenerRedirect />
        </Formik>
      )

      expect(screen.getByText('maritime.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
    })
  })
})
