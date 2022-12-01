import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { YourEmployer } from 'components/form/employer/YourEmployer/YourEmployer'
import { noop } from 'helpers/noop/noop'
import { yupEditEmployers } from 'components/form/EditEmployer/EditEmployer'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

export default {
  title: 'Components/Form/Employer/Sections/YourEmployer',
  component: YourEmployer,
} as ComponentMeta<typeof YourEmployer>

const { data } = useGetRecentEmployers()
const initialValues = {
  employers: data,
}

const Template: ComponentStory<typeof YourEmployer> = (args) => {
  return (
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <YourEmployer index={args.index} />
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

const WithValidationsTemplate: ComponentStory<typeof YourEmployer> = (args) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers}
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

export const WithValidations = WithValidationsTemplate.bind({})
WithValidations.args = {
  index: '1',
}
