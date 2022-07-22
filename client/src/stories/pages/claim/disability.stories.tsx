import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Formik, Form } from 'formik'
import { noop } from 'helpers/noop/noop'
import { Disability, DisabilityPageDefinition } from 'pages/claim/disability'

export default {
  title: 'Pages/Claim Form/Disability Status',
  component: Disability,
} as ComponentMeta<typeof Disability>

const Template: ComponentStory<typeof Disability> = () => {
  const initialValues = DisabilityPageDefinition.initialValues
  const validationSchema = DisabilityPageDefinition.validationSchema

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Disability />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
