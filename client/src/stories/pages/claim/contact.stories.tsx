import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Formik, Form } from 'formik'
import Contact, { ContactPageDefinition } from 'pages/claim/contact'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Pages/Claim Form/Contact Information',
  component: Contact,
} as ComponentMeta<typeof Contact>

const Template: ComponentStory<typeof Contact> = () => {
  const initialValues = ContactPageDefinition.initialValues
  const validationSchema = ContactPageDefinition.validationSchema
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Contact />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
