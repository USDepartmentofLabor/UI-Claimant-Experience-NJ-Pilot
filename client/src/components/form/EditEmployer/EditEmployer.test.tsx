import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { EditEmployer } from './EditEmployer'

describe('Edit Employer Component', () => {
  it('renders correctly', () => {
    const initialValues = {
      employers: [
        {
          name: 'Alpha',
          employer_address: {
            address: '123 Main St',
            city: 'Seattle',
            state: 'WA',
            zipcode: '01234',
          },
          employer_phone: '123-456-7890',
        },
        {
          name: 'Beta',
          employer_address: {
            address: '456 First St',
            city: 'Manhattan',
            state: 'NY',
            zipcode: '12345',
          },
          employer_phone: '987-654-3210',
        },
        {
          name: 'Gamma',
          employer_address: {
            address: '789 Rick Rd',
            city: 'Trenton',
            state: 'NJ',
            zipcode: '23456',
          },
          employer_phone: '555-123-9870',
        },
      ],
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
