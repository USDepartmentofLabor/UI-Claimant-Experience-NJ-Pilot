import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { YourEmployer } from 'components/form/employer/YourEmployer/YourEmployer'
import { noop } from 'helpers/noop/noop'
import {
  EMPLOYER_SKELETON,
  yupEditEmployer,
} from 'components/form/EditEmployer/EditEmployer'

export default {
  title: 'Components/Form/Employer/Sections/YourEmployer',
  component: YourEmployer,
} as ComponentMeta<typeof YourEmployer>

const Template: ComponentStory<typeof YourEmployer> = () => {
  return (
    <Formik initialValues={EMPLOYER_SKELETON} onSubmit={noop}>
      <Form>
        <YourEmployer />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})

const onSubmit = () => {
  console.log('Submitted!')
}

const WithValidationsTemplate: ComponentStory<typeof YourEmployer> = () => {
  return (
    <Formik
      initialValues={EMPLOYER_SKELETON}
      validationSchema={yupEditEmployer}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <YourEmployer />
          <Button type="submit">Validate me</Button>
        </Form>
      )}
    </Formik>
  )
}

export const WithValidations = WithValidationsTemplate.bind({})
