import { ComponentStory, Meta, Story } from '@storybook/react'
import { Form, Formik } from 'formik'
import { Label } from '@trussworks/react-uswds'
import * as yup from 'yup'
import { DateInputField } from './DateInputField'
import { noop } from 'helpers/noop/noop'
import { yupDate } from 'validations/yup/custom'
import { ComponentProps } from 'react'

type DateInputFieldStoryProps = ComponentProps<typeof DateInputField> & {
  initialValue?: string
}

export default {
  title: 'Components/Form/Fields/Date Input Field',
  component: DateInputField,
} as Meta<DateInputFieldStoryProps>

const DefaultTemplate: Story<DateInputFieldStoryProps> = ({
  initialValue,
  ...componentProps
}) => {
  const initialValues = {
    [componentProps.name]: initialValue || '',
  }

  return (
    <Formik initialValues={initialValues} onSubmit={noop}>
      <Form>
        <DateInputField {...componentProps} />
      </Form>
    </Formik>
  )
}

export const Default = DefaultTemplate.bind({})
Default.args = {
  name: 'example_date',
  legend: 'Date Input',
}

export const Readonly = DefaultTemplate.bind({})
Readonly.args = {
  name: 'example_date',
  legend: 'Date Input',
  readOnly: true,
  disabled: true,
  initialValue: '2001-10-23',
}

const WithFormikValueTemplate: ComponentStory<typeof DateInputField> = (
  args
) => {
  const initialValues = {
    [args.name]: '',
  }

  const validationSchema = yup.object().shape({
    [args.name]: yupDate(String(args.legend)),
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={noop}
    >
      {(props) => (
        <Form>
          <DateInputField {...args} />
          <Label htmlFor={'formik_value'}>Formik Value:</Label>
          <span id="formik_value">{props.values[args.name]}</span>
        </Form>
      )}
    </Formik>
  )
}

export const ShowFormikValue = WithFormikValueTemplate.bind({})
ShowFormikValue.args = {
  name: 'example_date',
  legend: 'Type a date below',
  hint: 'The ISO8601 value formik handles will be displayed below in real time',
}
