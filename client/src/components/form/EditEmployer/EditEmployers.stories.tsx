import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  EditEmployer,
  EMPLOYER_SKELETON,
  yupEditEmployer,
} from './EditEmployer'
import { Form, Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import { Button } from '@trussworks/react-uswds'
import { FormErrorSummary } from 'components/form/FormErrorSummary/FormErrorSummary'
import * as React from 'react'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

export default {
  title: 'Components/Form/Employer/EditEmployer',
  component: EditEmployer,
} as ComponentMeta<typeof EditEmployer>

const Template: ComponentStory<typeof EditEmployer> = () => {
  const { data } = useGetRecentEmployers()
  /* Add input from child components here */
  return (
    <Formik initialValues={data[0]} onSubmit={noop}>
      <Form>
        <EditEmployer />
      </Form>
    </Formik>
  )
}

export const Default = Template.bind({})

const Invalid: ComponentStory<typeof EditEmployer> = () => {
  const { data } = useGetRecentEmployers()
  /* Add input from child components here */
  return (
    <Formik initialValues={data[5]} onSubmit={noop}>
      <Form>
        <EditEmployer />
      </Form>
    </Formik>
  )
}

export const InvalidIndex = Invalid.bind({})

/* Possibly make more templates for conditionals in the components */

const renderWithValidations = (initialValues: any) => (
  <Formik
    initialValues={initialValues}
    validationSchema={yupEditEmployer}
    onSubmit={noop}
  >
    {({ errors, setFormikState, submitCount }) => {
      const showErrorSummary = submitCount > 0 && Object.keys(errors).length > 0

      return (
        <Form>
          {showErrorSummary && (
            <FormErrorSummary key={submitCount} errors={errors} />
          )}
          <EditEmployer />
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
          {errors && Object.keys(errors).length > 0 && (
            <div>
              <pre>{JSON.stringify(errors, null, 2)}</pre>
            </div>
          )}
        </Form>
      )
    }}
  </Formik>
)
const WithValidation: ComponentStory<typeof EditEmployer> = () => {
  /* Add input from child components here */
  const { data } = useGetRecentEmployers()

  return renderWithValidations(data[0])
}

export const Validated = WithValidation.bind({})

const ManuallyAddedTemplate: ComponentStory<typeof EditEmployer> = () => {
  const initialValues = { ...EMPLOYER_SKELETON, is_imported: false }
  return renderWithValidations(initialValues)
}

export const ManuallyAddedEmployer = ManuallyAddedTemplate.bind({})
