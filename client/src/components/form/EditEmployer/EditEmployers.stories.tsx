import { ComponentMeta, ComponentStory } from '@storybook/react'
import { EditEmployer, yupEditEmployers } from './EditEmployer'
import { Form, Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import { ClaimantInput } from 'types/claimantInput'
import { Button } from '@trussworks/react-uswds'
import { i18n_claimForm } from '../../../i18n/i18n'

export default {
  title: 'Components/Form/EditEmployer',
  component: EditEmployer,
} as ComponentMeta<typeof EditEmployer>

const Template: ComponentStory<typeof EditEmployer> = (args) => {
  /* Add input from child components here */
  const initialValues: ClaimantInput = {
    employers: [{ name: 'Apple' }, { name: 'Microsoft' }, { name: 'Wendys' }],
  }

  return (
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <EditEmployer index={args.index} />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  index: '0',
}

export const InvalidIndex = Template.bind({})
InvalidIndex.args = {
  index: '5',
}

/* Possibly make more templates for conditionals in the components */

const WithValidation: ComponentStory<typeof EditEmployer> = (args) => {
  /* Add input from child components here */
  const initialValues: ClaimantInput = {
    employers: [{ name: 'Apple' }, { name: 'Microsoft' }, { name: 'Wendys' }],
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployers(i18n_claimForm.t)}
      onSubmit={noop}
    >
      <Form>
        <EditEmployer index={args.index} />
        <Button type="submit">Validate</Button>
      </Form>
    </Formik>
  )
}

export const FirstEmployer = WithValidation.bind({})
Default.args = {
  index: '0',
}

/* Possibly make more templates for conditionals in the components */

export const SecondEmployer = WithValidation.bind({})
SecondEmployer.args = {
  index: '1',
}
