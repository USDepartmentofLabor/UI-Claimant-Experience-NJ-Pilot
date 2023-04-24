import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { WorkLocation } from './WorkLocation'
import { noop } from 'helpers/noop/noop'
import { Button } from '@trussworks/react-uswds'
import {
  EMPLOYER_SKELETON,
  yupEditEmployer,
} from 'components/form/EditEmployer/EditEmployer'

export default {
  title: 'Components/Form/Employer/Sections/WorkLocation',
  component: WorkLocation,
} as ComponentMeta<typeof WorkLocation>

const Template: ComponentStory<typeof WorkLocation> = () => {
  return (
    <Formik
      initialValues={EMPLOYER_SKELETON}
      validationSchema={yupEditEmployer}
      onSubmit={noop}
    >
      <Form>
        <WorkLocation />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})

const onSubmit = () => {
  console.log('Submitted!')
}

const WithValidationsTemplate: ComponentStory<typeof WorkLocation> = () => {
  return (
    <Formik
      initialValues={EMPLOYER_SKELETON}
      validationSchema={yupEditEmployer}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <WorkLocation />
          <Button type="submit">Validate me</Button>
        </Form>
      )}
    </Formik>
  )
}

export const WithValidations = WithValidationsTemplate.bind({})
