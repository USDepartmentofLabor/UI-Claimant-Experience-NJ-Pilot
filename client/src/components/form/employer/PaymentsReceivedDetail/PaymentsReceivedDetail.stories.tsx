import { ComponentMeta, ComponentStory } from '@storybook/react'

import PaymentsReceivedDetail from './PaymentsReceivedDetail'
import { Form, Formik } from 'formik'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Components/Form/Employer/Sections/Payments Received Detail',
  component: PaymentsReceivedDetail,
} as ComponentMeta<typeof PaymentsReceivedDetail>

const Template: ComponentStory<typeof PaymentsReceivedDetail> = (args) => {
  const initialValues = { other_pay: [] }

  return (
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <PaymentsReceivedDetail
          name={args.name}
          label={args.label}
          description={args.description}
          payType={args.payType}
        />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'severance',
  label: 'Severance Snape',
  description: 'Potion Master',
  payType: 'severance',
}

export const WithDates = Template.bind({})
WithDates.args = {
  name: 'holiday',
  label: 'Holiday pay',
  description: 'Holiday money',
  payType: 'holiday',
}

export const WithoutDatesValues = Template.bind({})
WithoutDatesValues.args = {
  name: 'final_paycheck',
  label: 'Last paycheck',
  description: 'No more money for you',
  payType: 'final_paycheck',
}

export const WithOtherPayValues = Template.bind({})
WithOtherPayValues.args = {
  name: 'other_pay',
  label: 'Other pay',
  description: 'Other $$',
  payType: 'other_pay',
}
