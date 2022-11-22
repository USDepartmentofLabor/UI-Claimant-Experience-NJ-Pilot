import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { WorkLocation } from './WorkLocation'
import { noop } from 'helpers/noop/noop'
import { Button } from '@trussworks/react-uswds'
import { yupEditEmployers } from 'components/form/EditEmployer/EditEmployer'

export default {
  title: 'Components/Form/Employer/Sections/WorkLocation',
  component: WorkLocation,
} as ComponentMeta<typeof WorkLocation>

// TODO: Get from one place
const initialValues = {
  employers: [
    {
      name: 'Tesla',
      is_full_time: undefined,
      employer_address: {
        address: '123 Main St',
        city: 'Trenton',
        state: 'NJ',
        zipcode: '01234',
      },
      employer_phone: '123-456-7890',
    },
    {
      name: 'Apple',
      is_full_time: undefined,
      employer_address: {
        address: '321 First St',
        city: 'Seattle',
        state: 'WA',
        zipcode: '43210',
      },
      employer_phone: '987-654-3210',
    },
  ],
}

const Template: ComponentStory<typeof WorkLocation> = (args) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers}
      onSubmit={noop}
    >
      <Form>
        <WorkLocation index={args.index} />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  index: '0',
}

const onSubmit = () => {
  console.log('Submitted!')
}

const WithValidationsTemplate: ComponentStory<typeof WorkLocation> = (args) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <WorkLocation {...args} />
          <Button type="submit">Validate me</Button>
        </Form>
      )}
    </Formik>
  )
}

export const WithValidations = WithValidationsTemplate.bind({})
WithValidations.args = {
  index: '1',
}
