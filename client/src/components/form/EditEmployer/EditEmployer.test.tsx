import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { EditEmployer } from './EditEmployer'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

describe('Edit Employer Component', () => {
  const { data } = useGetRecentEmployers()
  it('renders correctly', () => {
    const initialValues = {
      employers: data,
    }

    render(
      <Formik initialValues={initialValues} onSubmit={() => undefined}>
        <EditEmployer index={'2'} />
      </Formik>
    )
    screen.getByText(/Wendys/i)
  })

  it('displays an error if the index is invalid', () => {
    const initialValues = {
      employers: data,
    }

    render(
      <Formik initialValues={initialValues} onSubmit={() => undefined}>
        <EditEmployer index={'4'} />
      </Formik>
    )

    screen.getByText(/No employer defined for index/i)
  })
})
