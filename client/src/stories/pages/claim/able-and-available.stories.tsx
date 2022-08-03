import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Formik, Form } from 'formik'
import { noop } from 'helpers/noop/noop'
import {
  AbleAndAvailable,
  AbleAndAvailablePageDefinition,
} from 'pages/claim/able-and-available'

export default {
  title: 'Pages/Claim Form/Able and Available Status',
  component: AbleAndAvailable,
} as ComponentMeta<typeof AbleAndAvailable>

const Template: ComponentStory<typeof AbleAndAvailable> = () => {
  const initialValues = AbleAndAvailablePageDefinition.initialValues
  const validationSchema = AbleAndAvailablePageDefinition.validationSchema

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <AbleAndAvailable />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
