import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { Review } from 'pages/claim/review'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'

describe('Review page', () => {
  beforeEach(() => {
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <Review />
      </Formik>
    )
  })

  it('renders properly', async () => {
    expect(screen.queryByText('preamble.heading')).toBeInTheDocument()
  })

  it('toggles fields conditionally', async () => {
    const user = userEvent.setup()

    expect(screen.getByLabelText('certify.label')).toBeInTheDocument()

    await user.click(
      screen.getByRole('checkbox', {
        name: 'certify.label',
      })
    )

    expect(
      screen.getByRole('checkbox', {
        name: 'certify.label',
      })
    ).toBeChecked()
  })
})
