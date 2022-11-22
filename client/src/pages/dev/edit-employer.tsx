import {
  EditEmployer,
  yupEditEmployers,
} from 'components/form/EditEmployer/EditEmployer'

import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { noop } from 'helpers/noop/noop'
import { NextPage } from 'next'
import { ClaimantInput } from 'types/claimantInput'
const EditEmployerPage: NextPage = () => {
  const initialValues: ClaimantInput = {
    /*edit the below employer with initial values as needed */
    employers: [
      {
        name: 'Apple',
        isFullTime: undefined,
        employer_address: {
          address: '123 Main St',
          city: 'Seattle',
          state: 'WA',
          zipcode: '01234',
        },
        employer_phone: '123-456-7890',
      },
      {
        name: 'Microsoft',
        isFullTime: undefined,
        employer_address: {
          address: '456 First St',
          city: 'Manhattan',
          state: 'NY',
          zipcode: '12345',
        },
        employer_phone: '987-654-3210',
      },
      {
        name: 'Wendys',
        isFullTime: undefined,
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
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers}
      onSubmit={noop}
    >
      <div>
        <Form>
          <h1 data-testid="claim-form-page-heading">
            Test Edit Employer Component
          </h1>
          <EditEmployer index="0" />
          <Button type="submit">Validate</Button>
        </Form>
      </div>
    </Formik>
  )
}

export default EditEmployerPage
