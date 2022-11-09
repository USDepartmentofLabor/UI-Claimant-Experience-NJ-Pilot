import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { YourEmployer } from './YourEmployer'
import * as yup from 'yup'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Components/YourEmployer',
  component: YourEmployer,
} as ComponentMeta<typeof YourEmployer>

const initialValues = {
  employers: [
    { name: 'Tesla', is_full_time: undefined },
    { name: 'Apple', is_full_time: undefined },
  ],
}
const validationSchema = yup.object().shape({})

const Template: ComponentStory<typeof YourEmployer> = (args) => {
  return (
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <YourEmployer employerIndex={args.employerIndex} />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  employerIndex: undefined,
}

const onSubmit = () => {
  console.log('Submitted!')
}

//TODO-once validation is added, then add to this logic flow
const WithFormikValueTemplate: ComponentStory<typeof YourEmployer> = (args) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <YourEmployer {...args} />
          <Button type="submit">Validate me</Button>
        </Form>
      )}
    </Formik>
  )
}

export const ShowFormikValue = WithFormikValueTemplate.bind({})
ShowFormikValue.args = {
  employerIndex: 1,
}
