import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Button, Fieldset } from '@trussworks/react-uswds'
import { YourEmployer } from 'components/form/employer/YourEmployer/YourEmployer'
import { noop } from 'helpers/noop/noop'
import {
  EMPLOYER_SKELETON,
  yupEditEmployer,
} from 'components/form/EditEmployer/EditEmployer'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

export default {
  title: 'Components/Form/Employer/Sections/YourEmployer',
  component: YourEmployer,
} as ComponentMeta<typeof YourEmployer>

const Template: ComponentStory<typeof YourEmployer> = () => {
  const { data } = useGetRecentEmployers()
  return (
    <Formik initialValues={data[0]} onSubmit={noop}>
      <Form>
        <YourEmployer />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})

const onSubmit = () => {
  console.log('Submitted!')
}

const WithValidationsTemplate: ComponentStory<typeof YourEmployer> = () => {
  const initialValues = { ...EMPLOYER_SKELETON, is_imported: true }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployer}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <YourEmployer />
          <Button type="submit">Validate me</Button>
        </Form>
      )}
    </Formik>
  )
}

export const WithValidations = WithValidationsTemplate.bind({})

const NonImportedEmployerTemplate: ComponentStory<typeof YourEmployer> = () => {
  const initialValues = { ...EMPLOYER_SKELETON, is_imported: false }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yupEditEmployer}
      onSubmit={onSubmit}
    >
      {({ setFormikState, submitCount }) => {
        return (
          <Form>
            <Fieldset>
              <YourEmployer />
            </Fieldset>
            <Button
              type="submit"
              onClick={() =>
                setFormikState((previousState) => ({
                  ...previousState,
                  submitCount: submitCount + 1,
                }))
              }
            >
              Validate
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}

export const NonImportedEmployer = NonImportedEmployerTemplate.bind({})
