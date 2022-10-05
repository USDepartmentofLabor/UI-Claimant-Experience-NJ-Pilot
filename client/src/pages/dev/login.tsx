import { NextPage } from 'next'
import { Form, Formik } from 'formik'
import { SubmitButton } from 'components/layouts/ClaimForm/SubmitButton/SubmitButton'
import { object, string } from 'yup'

import { TextField } from 'components/form/fields/TextField/TextField'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import { yupDate } from 'validations/yup/custom'
import { MouseEventHandler } from 'react'

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

  const devLoginValidationSchema = object().shape({
    first_name: string().max(20, 'Must be 20 characters or less').required(),
    middle_initial: string().max(1),
    last_name: string().max(20, 'Must be 20 characters or less').required(),
    email: string()
      .matches(/@/, 'Must use a valid email address and include @')
      .required(),
    phone_number: string()
      .matches(
        /^\d{10}$/,
        'Must be 10 digits with no spaces or special characters (ex. 1234567890)'
      )
      .required(),
    ssn: string()
      .matches(/^[0-9]{3}-[0-9]{2}-[0-9]{4}$/, 'Must be in format 000-00-0000')
      .required(),
    birthdate: yupDate('birthdate').required(),
  })

  return (
    <>
      <h1>Dev Test Login</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={devLoginValidationSchema}
      >
        {({ submitCount, isValid, submitForm, setFormikState }) => {
          const handleSubmitForm: MouseEventHandler<HTMLButtonElement> = (
            e
          ) => {
            e.preventDefault()
            if (isValid) {
              submitForm()
            } else {
              setFormikState((previousState) => ({
                ...previousState,
                submitCount: submitCount + 1,
              }))
            }
          }

          return (
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
                <SubmitButton onClick={handleSubmitForm}>Submit</SubmitButton>
              </>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default DevLogin
