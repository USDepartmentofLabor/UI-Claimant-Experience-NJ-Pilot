import { ComponentMeta, ComponentStory } from '@storybook/react'

import PaymentsReceived from './PaymentsReceived'
import { Form, Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import { EMPLOYER_SKELETON } from 'components/form/EditEmployer/EditEmployer'

export default {
  title: 'Components/Form/Employer/Sections/PaymentsReceived',
  component: PaymentsReceived,
} as ComponentMeta<typeof PaymentsReceived>

const Template: ComponentStory<typeof PaymentsReceived> = () => {
  return (
    <Formik initialValues={EMPLOYER_SKELETON} onSubmit={noop}>
      <Form>
        <PaymentsReceived />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
