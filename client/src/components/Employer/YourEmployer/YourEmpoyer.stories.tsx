import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { YourEmployer } from './YourEmployer'
import { noop } from 'helpers/noop/noop'
import { i18n_claimForm } from '../../../i18n/i18n'
import { yupEditEmployers } from '../../form/EditEmployer/EditEmployer'

export default {
  title: 'Components/Employer/YourEmployer',
  component: YourEmployer,
} as ComponentMeta<typeof YourEmployer>

const initialValues = {
  employers: [
    { name: 'Tesla', is_full_time: undefined },
    { name: 'Apple', is_full_time: undefined },
  ],
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

const WithFormikValueTemplate: ComponentStory<typeof YourEmployer> = (args) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers(i18n_claimForm.t)}
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

export const ShowFormikValue = WithFormikValueTemplate.bind({})
ShowFormikValue.args = {
  index: '1',
}
