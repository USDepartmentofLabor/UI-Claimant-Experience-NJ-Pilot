import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'

import { noop } from 'helpers/noop/noop'
import ScreenerRedirect from 'pages/screener-redirect'

describe('Screener-redirect page', () => {
  it('renders properly', () => {
    ScreenerRedirect
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <ScreenerRedirect />
      </Formik>
    )

    expect(screen.getByText('ip_deny.heading')).toBeInTheDocument()

    expect(screen.getByText('canada.heading')).toBeInTheDocument()

    expect(screen.getByText('non_resident.heading')).toBeInTheDocument()

    expect(screen.getByText('other_state.heading')).toBeInTheDocument()

    expect(screen.getByText('disability.heading')).toBeInTheDocument()

    expect(screen.getByText('military_mvp.heading')).toBeInTheDocument()

    expect(screen.getByText('military_ip.heading')).toBeInTheDocument()

    expect(screen.getByText('maritime.heading')).toBeInTheDocument()
  })
})
