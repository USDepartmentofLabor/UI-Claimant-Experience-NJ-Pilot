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
    expect(screen.getByText(/Wendys/i)).toBeInTheDocument()
    expect(
      screen.getByRole('radio', {
        name: 'your_employer.is_full_time.options.full_time',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('employers[2].self_employed.yes')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('group', {
        name: 'payments_received.payments_received_detail.pay_type.label',
      })
    ).toBeInTheDocument()
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
