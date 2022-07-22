import { Union, UnionPageDefinition } from 'pages/claim/union'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'

export default {
  title: 'Pages/Claim Form/Union',
  component: Union,
} as ComponentMeta<typeof Union>
const noop = () => undefined

const Template: ComponentStory<typeof Union> = () => {
  const validationSchema = UnionPageDefinition.validationSchema
  const initialValues = UnionPageDefinition.initialValues

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Union />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
