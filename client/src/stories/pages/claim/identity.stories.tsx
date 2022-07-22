import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Identity, IdentityPageDefinition } from 'pages/claim/identity'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Pages/Claim Form/Identity',
  component: Identity,
} as ComponentMeta<typeof Identity>

const Template: ComponentStory<typeof Identity> = () => {
  const initialValues = IdentityPageDefinition.initialValues
  const validationSchema = IdentityPageDefinition.validationSchema

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Identity />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
