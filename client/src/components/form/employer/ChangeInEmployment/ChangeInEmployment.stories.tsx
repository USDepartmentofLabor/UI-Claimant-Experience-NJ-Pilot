import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { ChangeInEmployment } from './ChangeInEmployment'
import { noop } from 'helpers/noop/noop'

import { yupEditEmployers } from '../../EditEmployer/EditEmployer'

export default {
  title: 'Components/form/Employer/Sections/Change In Employment',
  component: ChangeInEmployment,
} as ComponentMeta<typeof ChangeInEmployment>

const initialValues = {
  employers: [
    {
      name: 'Tesla',
      is_full_time: undefined,
      separation_circumstance: undefined,
    },
    {
      name: 'Apple',
      is_full_time: undefined,
      separation_circumstance: undefined,
    },
  ],
}

const Template: ComponentStory<typeof ChangeInEmployment> = (args) => {
  return (
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <ChangeInEmployment index={args.index} />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  index: '0',
}

const WithFormikValueTemplate: ComponentStory<typeof ChangeInEmployment> = (
  args
) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers}
      onSubmit={noop}
    >
      {() => (
        <Form>
          <ChangeInEmployment {...args} />
          <Button type="submit">Validate me</Button>
        </Form>
      )}
    </Formik>
  )
}

export const ShowFormikValue = WithFormikValueTemplate.bind({})
ShowFormikValue.args = {
  index: '1',
}