import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { EditEmployer } from './EditEmployer'

describe('Edit Employer Component', () => {
  it('renders correctly', () => {
    const initialValues = {
      employers: [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }],
    }

    render(
      <Formik initialValues={initialValues} onSubmit={() => undefined}>
        <EditEmployer index={'2'} />
      </Formik>
    )
    screen.getByText(/Gamma/i)
  })

  it('displays an error if the index is invalid', () => {
    const initialValues = {
      employers: [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }],
    }

    render(
      <Formik initialValues={initialValues} onSubmit={() => undefined}>
        <EditEmployer index={'4'} />
      </Formik>
    )

    screen.getByText(/No employer defined for index/i)
  })
})
