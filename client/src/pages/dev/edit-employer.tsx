import {
  EditEmployer,
  yupEditEmployers,
} from 'components/form/EditEmployer/EditEmployer'

import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { noop } from 'helpers/noop/noop'
import { i18n_claimForm } from '../../i18n/i18n'
import { NextPage } from 'next'
import { ClaimantInput } from 'types/claimantInput'
const EditEmployerPage: NextPage = () => {
  const initialValues: ClaimantInput = {
    employers: [{ name: 'Apple', isFullTime: undefined }],
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers(i18n_claimForm.t)}
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
