import { NextPage } from 'next'
import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { TextField } from 'components/form/fields/TextField/TextField'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'

type Login = {
  first_name: string
  middle_initial?: string
  last_name: string
  email: string
  phone_number: string
  ssn: string
  birthdate: string
}

const DevLogin: NextPage = () => {
  const handleSubmit = async (values: Login) => {
    console.log('submit login form')
    await new Promise((r) => setTimeout(r, 500))
    alert(JSON.stringify(values, null, 2))
  }
  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    ssn: '',
    birthdate: '',
  }

  return (
    <>
      <h1>Dev Test Login</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          <>
            <TextField
              id={`first_name`}
              name={`first_name`}
              label="First name"
              type="text"
              required
            />
            <TextField
              id="middle_initial"
              name="middle_initial"
              label="Middle initial (optional)"
              type="text"
            />
            <TextField
              id="last_name"
              name="last_name"
              label="Last name"
              type="text"
              required
            />
            <TextField
              id="email"
              name="email"
              label="Email address"
              type="email"
              required
            />
            <TextField
              label="Phone number"
              hint="Must be in format 5555555555 (10 digits)"
              name="phone_number"
              type="tel"
              required
            />
            <TextField
              label="Social security number"
              hint="Must be in format 000-00-0000"
              name="ssn"
              type="text"
              required
            />
            <DateInputField name="birthdate" legend="Date of birth" />
            <Button type="submit">Submit</Button>
          </>
        </Form>
      </Formik>
    </>
  )
}

export default DevLogin
