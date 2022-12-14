import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BusinessInterests } from 'components/form/employer/BusinessInterests/BusinessInterests'
import { Form, Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import {
  EMPLOYER_SKELETON,
  yupEditEmployer,
} from 'components/form/EditEmployer/EditEmployer'

export default {
  title: 'Components/Form/Employer/Sections/BusinessInterests',
  component: BusinessInterests,
} as ComponentMeta<typeof BusinessInterests>

const Template: ComponentStory<typeof BusinessInterests> = () => {
  return (
    <Formik
      initialValues={EMPLOYER_SKELETON}
      validationSchema={yupEditEmployer}
      onSubmit={noop}
    >
      <Form>
        <BusinessInterests />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
