import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { WorkLocation } from './WorkLocation'
import { noop } from 'helpers/noop/noop'
import { Button } from '@trussworks/react-uswds'
import { yupEditEmployers } from 'components/form/EditEmployer/EditEmployer'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

export default {
  title: 'Components/Form/Employer/Sections/WorkLocation',
  component: WorkLocation,
} as ComponentMeta<typeof WorkLocation>

const { data } = useGetRecentEmployers()
const initialValues = {
  employers: data,
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
