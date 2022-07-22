import { ComponentMeta, ComponentStory } from '@storybook/react'

import Demographics, {
  DemographicsPageDefinition,
} from 'pages/claim/demographics'
import { Formik, Form } from 'formik'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Pages/Claim Form/Demographics',
  component: Demographics,
} as ComponentMeta<typeof Demographics>

const Template: ComponentStory<typeof Demographics> = () => {
  const initialValues = DemographicsPageDefinition.initialValues
  const validationSchema = DemographicsPageDefinition.validationSchema

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Demographics />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
