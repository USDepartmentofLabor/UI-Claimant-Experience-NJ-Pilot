import { act, render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import EditEmployerPage from 'pages/dev/edit-employer'

describe('Edit Employer Component', () => {
  it('renders correctly', async () => {
    const initialValues = {
      employers: [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }],
    }

    await act(() =>
      render(
        <Formik initialValues={initialValues} onSubmit={() => undefined}>
          <EditEmployerPage />
        </Formik>
      )
    )
    expect(screen.getByText(/apple/i)).toBeInTheDocument()
  })
})
