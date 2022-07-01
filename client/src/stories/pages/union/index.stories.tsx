import { Union } from 'pages/claim/union'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'

export default {
  title: 'Pages/Form/Union',
  component: Union,
} as ComponentMeta<typeof Union>
const noop = () => undefined

const Template: ComponentStory<typeof Union> = () => {
  const { t } = useTranslation('claimForm')
  // const validationSchema = UnionPage.pageSchema(t);
  const initialValues = {
    union: {},
  }

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Union />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
