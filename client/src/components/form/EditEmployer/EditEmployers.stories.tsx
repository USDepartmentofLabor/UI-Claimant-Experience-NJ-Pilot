import { ComponentMeta, ComponentStory } from '@storybook/react'
import { EditEmployer, yupEditEmployers } from './EditEmployer'
import { Form, Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import { ClaimantInput } from 'types/claimantInput'
import { Button } from '@trussworks/react-uswds'

export default {
  title: 'Components/Form/Employer/EditEmployer',
  component: EditEmployer,
} as ComponentMeta<typeof EditEmployer>

const Template: ComponentStory<typeof EditEmployer> = (args) => {
  /* Add input from child components here */
  const initialValues: ClaimantInput = {
    employers: [
      {
        name: 'Apple',
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
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <EditEmployer index={args.index} />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  index: '0',
}

export const InvalidIndex = Template.bind({})
InvalidIndex.args = {
  index: '5',
}

/* Possibly make more templates for conditionals in the components */

const WithValidation: ComponentStory<typeof EditEmployer> = (args) => {
  /* Add input from child components here */
  const initialValues: ClaimantInput = {
    employers: [
      {
        name: 'Apple',
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
      {({ errors, setFormikState, submitCount }) => (
        <Form>
          <EditEmployer index={args.index} />
          <Button
            type="submit"
            onClick={() =>
              setFormikState((previousState) => ({
                ...previousState,
                submitCount: submitCount + 1,
              }))
            }
          >
            Validate
          </Button>
          {errors?.employers?.[parseInt(args.index)] &&
            Object.keys(errors.employers[parseInt(args.index)]).length > 0 && (
              <div>
                <pre>
                  {JSON.stringify(
                    errors.employers[parseInt(args.index)],
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
        </Form>
      )}
    </Formik>
  )
}

export const FirstEmployer = WithValidation.bind({})
FirstEmployer.args = {
  index: '0',
}

/* Possibly make more templates for conditionals in the components */

export const SecondEmployer = WithValidation.bind({})
SecondEmployer.args = {
  index: '1',
}
