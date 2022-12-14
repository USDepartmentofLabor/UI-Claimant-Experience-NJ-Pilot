import {
  EditEmployer,
  yupEditEmployers,
} from 'components/form/EditEmployer/EditEmployer'

import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { noop } from 'helpers/noop/noop'
import { NextPage } from 'next'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

const EditEmployerPage: NextPage = () => {
  const { data } = useGetRecentEmployers()

  return (
    <Formik
      initialValues={data[0]}
      validationSchema={yupEditEmployers}
      onSubmit={noop}
    >
      <div>
        <Form>
          <h1 data-testid="claim-form-page-heading">
            Test Edit Employer Component
          </h1>
          <EditEmployer />
          <Button type="submit">Validate</Button>
        </Form>
      </div>
    </Formik>
  )
}

export default EditEmployerPage
