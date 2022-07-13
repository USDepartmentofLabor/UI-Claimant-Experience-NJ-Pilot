import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { Fieldset } from '@trussworks/react-uswds'

import { Name } from './Name'
import { noop } from 'helpers/noop/noop'

export default {
  title: 'Components/Form/Name',
  component: Name,
} as ComponentMeta<typeof Name>

const Template: ComponentStory<typeof Name> = (args) => {
  const { t } = useTranslation('common')

  const validationSchema = yup.object().shape({
    [args.name]: yup.object().shape({
      first_name: yup.string().required(t('validation.required')),
      middle_name: yup.string().optional(),
      last_name: yup.string().required(t('validation.required')),
    }),
  })

  const initialValues = {
    [args.name]: {
      first_name: '',
      middle_name: '',
      last_name: '',
    },
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      <Form>
        <Fieldset>
          <Name {...args} />
        </Fieldset>
      </Form>
    </Formik>
  )
}

export const ClaimantName = Template.bind({})
ClaimantName.args = {
  name: 'claimant-name',
}

export const AdditionalName = Template.bind({})
AdditionalName.args = {
  name: 'additional-name-{n}',
}
