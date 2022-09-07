import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button, Fieldset } from '@trussworks/react-uswds'
import { PhoneNumberField } from './PhoneNumberField'
import * as yup from 'yup'
import { noop } from 'helpers/noop/noop'
import { yupPhone } from 'validations/yup/custom'

export default {
  title: 'Components/Form/PhoneNumberField',
  component: PhoneNumberField,
} as ComponentMeta<typeof PhoneNumberField>

const Template: ComponentStory<typeof PhoneNumberField> = (args) => {
  const initialValues = {
    [args.name]: {
      number: '',
      sms: false,
    },
  }

  const validationSchema = yup.object().shape({ [args.name]: yupPhone })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Fieldset>
          <PhoneNumberField {...args} />
        </Fieldset>
        <Button type="submit">Validate me</Button>
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'sample_phone',
}
