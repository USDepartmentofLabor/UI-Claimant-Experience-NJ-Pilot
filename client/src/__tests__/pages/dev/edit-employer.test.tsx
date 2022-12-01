import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import EditEmployerPage from 'pages/dev/edit-employer'

describe('Edit Employer Component', () => {
  it('renders correctly', () => {
    const initialValues = {
      employers: [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }],
    }

    render(
      <Formik initialValues={initialValues} onSubmit={() => undefined}>
        <EditEmployerPage />
      </Formik>
    )
    expect(screen.getByText(/apple/i)).toBeInTheDocument()
  })
})
