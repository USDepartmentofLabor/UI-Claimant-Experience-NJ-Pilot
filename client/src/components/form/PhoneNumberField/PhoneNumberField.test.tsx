import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'

import { PhoneNumberField } from './PhoneNumberField'

describe('Phone number component', () => {
  it('renders inputs for phone number', () => {
    const basename = 'test-phone'
    const initialValues = {
      [basename]: {
        number: '',
        sms: true,
      },
    }

    render(
      <Formik initialValues={initialValues} onSubmit={() => undefined}>
        <PhoneNumberField name={basename} label={basename} />
      </Formik>
    )

    const numberField = screen.getByLabelText(basename)
    const smsYesNo = screen.getByRole('group', {
      name: 'sms.label',
    })
    const yesSMS = within(smsYesNo).queryByRole('radio', {
      name: 'yes',
    })
    const noSMS = within(smsYesNo).queryByRole('radio', {
      name: 'no',
    })

    expect(numberField).toHaveValue('')
    expect(numberField).toHaveAttribute('id', `${basename}.number`)
    expect(numberField).toHaveAttribute('name', `${basename}.number`)

    expect(yesSMS).toBeChecked()
    expect(noSMS).not.toBeChecked()
    expect(yesSMS).toHaveAttribute('id', `${basename}.sms.yes`)
    expect(yesSMS).toHaveAttribute('name', `${basename}.sms`)
    expect(noSMS).toHaveAttribute('id', `${basename}.sms.no`)
    expect(noSMS).toHaveAttribute('name', `${basename}.sms`)
  })
})
