import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Fieldset } from '@trussworks/react-uswds'
import { Button } from '@trussworks/react-uswds'
import TextAreaField from './TextAreaField'
import { noop } from 'helpers/noop/noop'
import * as yup from 'yup'

export default {
  title: 'Components/Form/Text Area Field',
  component: TextAreaField,
} as ComponentMeta<typeof TextAreaField>

const Template: ComponentStory<typeof TextAreaField> = (args) => {
  const initialValues = {}

  return (
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <Fieldset>
          <TextAreaField {...args} />
        </Fieldset>
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'example_text_area_field',
  label: 'Example Text Area Field',
  hint: 'A helpful hint',
}

export const WithLabelBold = Template.bind({})
WithLabelBold.args = {
  name: 'example_text_area_field',
  label: 'Example Text Area Field With Bold Label',
  labelClassName: 'text-bold',
}

export const WithCharacterLimit = Template.bind({})
WithCharacterLimit.args = {
  name: 'example_text_area_field',
  label: 'Example Text Area With Character Limit',
  characterLimit: 255,
}

const WithFormikValueTemplate: ComponentStory<typeof TextAreaField> = (
  args
) => {
  const initialValues = {
    [args.name]: '',
  }

  const validationSchema = yup.object().shape({
    [args.name]: yup.string().required(),
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      {() => (
        <Form>
          <Fieldset>
            <TextAreaField {...args} />
          </Fieldset>
          <Button type="submit">Validate me</Button>
        </Form>
      )}
    </Formik>
  )
}

export const ShowFormikValue = WithFormikValueTemplate.bind({})
ShowFormikValue.args = {
  name: 'text_area_field',
  label: 'Click the button to see validation',
}
