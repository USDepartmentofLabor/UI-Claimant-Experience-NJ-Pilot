import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { YourEmployer, initialValues, validationSchema } from './YourEmployer'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Components/YourEmployer',
  component: YourEmployer,
} as ComponentMeta<typeof YourEmployer>

const Template: ComponentStory<typeof YourEmployer> = (args) => {
  const initialValues = {}

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

export const WithOnChangeHandler = Template.bind({})

const onSubmit = () => {
  console.log('Changed!')
}

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
