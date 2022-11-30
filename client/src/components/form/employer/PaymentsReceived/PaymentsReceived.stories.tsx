import { ComponentMeta, ComponentStory } from '@storybook/react'

import PaymentsReceived from './PaymentsReceived'
import { Form, Formik } from 'formik'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Components/Form/Employer/Sections/PaymentsReceived',
  component: PaymentsReceived,
} as ComponentMeta<typeof PaymentsReceived>

const Template: ComponentStory<typeof PaymentsReceived> = () => {
  const initialValues = { employers: [{ payments_received: [] }] }
  return (
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <PaymentsReceived employerIndex={0} />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
