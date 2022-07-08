import { ComponentMeta, ComponentStory } from '@storybook/react'

import Demographic, { DemographicPageDefinition } from 'pages/claim/demographic'
import { Formik, Form } from 'formik'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Pages/Form/Demographic',
  component: Demographic,
} as ComponentMeta<typeof Demographic>

const Template: ComponentStory<typeof Demographic> = () => {
  const initialValues = DemographicPageDefinition.initialValues
  const validationSchema = DemographicPageDefinition.validationSchema

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Demographic />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
