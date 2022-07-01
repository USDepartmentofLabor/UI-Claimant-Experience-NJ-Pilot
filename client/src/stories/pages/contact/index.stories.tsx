import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Formik, Form } from 'formik'
import { useTranslation } from 'react-i18next'
import { noop } from 'helpers/noop/noop'
import ContactInformation from 'pages/claim/contact'

export default {
  title: 'Pages/Form/Contact Information',
  component: ContactInformation,
} as ComponentMeta<typeof ContactInformation>

const Template: ComponentStory<typeof ContactInformation> = () => {
  const { t } = useTranslation('claimForm')
  // const validationSchema = ContactInformationPage.pageSchema(t);
  // const initialValues = {
  //   phones: [{ number: '555-543-7643' }],
  //   email_address: 'user@claimant.com',
  //   interpreter_required: undefined,
  //   preferred_language: '',
  // }

  return <ContactInformation />
}

export const Default = Template.bind({})
