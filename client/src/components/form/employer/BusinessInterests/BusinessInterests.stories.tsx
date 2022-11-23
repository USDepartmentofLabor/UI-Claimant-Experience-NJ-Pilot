import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BusinessInterests } from 'components/form/employer/BusinessInterests/BusinessInterests'
import { Form, Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import { yupEditEmployers } from 'components/form/EditEmployer/EditEmployer'
export default {
  title: 'Components/Form/Employer/Sections/BusinessInterests',
  component: BusinessInterests,
} as ComponentMeta<typeof BusinessInterests>

// TODO: Get from one place
const initialValues = {
  employers: [
    { name: 'Tesla', is_full_time: undefined },
    { name: 'Apple', is_full_time: undefined },
  ],
}

const Template: ComponentStory<typeof BusinessInterests> = (args) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers}
      onSubmit={noop}
    >
      <Form>
        <BusinessInterests index={args.index} />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  index: '0',
}
