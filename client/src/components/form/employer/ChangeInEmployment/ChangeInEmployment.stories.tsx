import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button } from '@trussworks/react-uswds'
import { ChangeInEmployment } from './ChangeInEmployment'
import { noop } from 'helpers/noop/noop'
import {
  EMPLOYER_SKELETON,
  yupEditEmployer,
} from '../../EditEmployer/EditEmployer'

export default {
  title: 'Components/form/Employer/Sections/Change In Employment',
  component: ChangeInEmployment,
} as ComponentMeta<typeof ChangeInEmployment>

const Template: ComponentStory<typeof ChangeInEmployment> = () => {
  return (
    <Formik initialValues={EMPLOYER_SKELETON} onSubmit={noop}>
      <Form>
        <ChangeInEmployment />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})

const WithFormikValueTemplate: ComponentStory<
  typeof ChangeInEmployment
> = () => {
  return (
    <Formik
      initialValues={EMPLOYER_SKELETON}
      validationSchema={yupEditEmployer}
      onSubmit={noop}
    >
      {() => (
        <Form>
          <ChangeInEmployment />
          <Button type="submit">Validate me</Button>
        </Form>
      )}
    </Formik>
  )
}

export const ShowFormikValue = WithFormikValueTemplate.bind({})
