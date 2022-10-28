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
    //
    // expect(screen.getByText('ip_deny.heading')).toBeInTheDocument()
    //
    // expect(screen.getByText('canada.heading')).toBeInTheDocument()
    //
    // expect(screen.getByText('non_resident.heading')).toBeInTheDocument()
    //
    // expect(screen.getByText('other_state.heading')).toBeInTheDocument()
    //
    // expect(screen.getByText('disability.heading')).toBeInTheDocument()
    //
    // expect(screen.getByText('military_mvp.heading')).toBeInTheDocument()
    //
    // expect(screen.getByText('military_ip.heading')).toBeInTheDocument()
    //
    // expect(screen.getByText('maritime.heading')).toBeInTheDocument()
  })
  describe('shows the correct content based on querystring values', () => {
    // const canUseFormDefaults = {
    //   screener_current_country_us: true,
    //   screener_live_in_canada: undefined,
    //   screener_job_last_eighteen_months: true,
    //   screener_all_work_nj: true,
    //   screener_any_work_nj: undefined,
    //   screener_currently_disabled: false,
    //   screener_military_service_eighteen_months: false,
    //   screener_maritime_employer_eighteen_months: false,
    // }
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
    })
    it('when not a resident of US or Canada', () => {
      const searchString1 = {
        screener_current_country_us: false,
        screener_live_in_canada: false,
      }

      makeMockWindowSearch(searchString1)

      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <ScreenerRedirect />
        </Formik>
      )
      expect(screen.getByText('non_resident.heading')).toBeInTheDocument()
    })
    // it('when needing to file in another state', () => {
    //
    // })
    // it('when on disability', () => {
    //
    // })
    // it('when worked in the military', () => {
    //
    // })
    // it('when had maritime employment', () => {
    //
    // })
  })
})
