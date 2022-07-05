import { screen, render, within } from '@testing-library/react'
import { Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import ContactInformation from 'pages/claim/contact'
import userEvent from '@testing-library/user-event'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

describe('ContactInformation component', () => {
  const initialValues = {
    email: undefined,
    phones: [],
    LOCAL_more_phones: undefined,
    interpreter_required: undefined,
    preferred_language: '',
  }

  it('renders properly', () => {
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <ContactInformation />
      </Formik>
    )

    // const verifiedFieldsSection = screen.getByTestId("verified-fields");
    // const verifiedFields = within(verifiedFieldsSection).getAllByRole(
    //   "listitem"
    // );
    // const verifiedEmailAddress = within(verifiedFieldsSection).getByText(
    //   "email"
    // );
    // const verifiedEmailAddressValue = within(verifiedFieldsSection).getByText(
    //   "test@test.com"
    // );
    // const verifiedPhoneNumber = within(verifiedFieldsSection).getByText(
    //   "phone"
    // );
    // const verifiedPhoneNumberValue = within(verifiedFieldsSection).getByText(
    //   "(123)-456-7890"
    // );
    // expect(verifiedFieldsSection).toBeInTheDocument();
    // expect(verifiedFields).toHaveLength(2);
    // expect(verifiedEmailAddress).toBeInTheDocument();
    // expect(verifiedEmailAddressValue).toBeInTheDocument();
    // expect(verifiedPhoneNumber).toBeInTheDocument();
    // expect(verifiedPhoneNumberValue).toBeInTheDocument();

    const interpreterField = screen.getByRole('group', {
      name: 'interpreter_required.label',
    })
    const interpreterYes = within(interpreterField).getByLabelText('yes')
    const interpreterNo = within(interpreterField).getByLabelText('no')
    expect(interpreterYes).toHaveAttribute('id', 'interpreter_required.yes')
    expect(interpreterNo).toHaveAttribute('id', 'interpreter_required.no')

    const phoneOne = screen.getByRole('textbox', {
      name: 'phone.number.label',
    })
    expect(phoneOne).toHaveAttribute('id', 'phones[0].number')

    const email = screen.getByRole('textbox', { name: 'email' })
    expect(email).toHaveAttribute('id', 'email')
    expect(email).toHaveAttribute('readonly', '')
    expect(email).toHaveAttribute('disabled', '')
  })

  it('displays alternate phone fields', async () => {
    const user = userEvent.setup()
    const { getAllByRole, getByRole } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <ContactInformation />
      </Formik>
    )
    const morePhones = getByRole('checkbox', { name: 'more_phones' })
    expect(morePhones).not.toBeChecked()

    await user.click(morePhones)

    const [phone1] = getAllByRole('textbox', {
      name: 'phone.number.label',
    })
    expect(phone1).toHaveAttribute('id', 'phones[0].number')
    // expect(phone2).toHaveAttribute('id', 'phones[1].number') todo: uncomment when formik values are working

    expect(phone1).toHaveValue('')
    expect(phone1).toHaveAttribute('name', `phones[0].number`)

    // expect(phone2).toHaveValue('')
    // expect(phone2).toHaveAttribute('name', `phones[1].number`)

    await user.click(morePhones)

    // expect(phone2).not.toBeInTheDocument() todo: uncomment when conditional working
  })

  it('conditionally displays preferred language', async () => {
    const user = userEvent.setup()
    const { getByRole, getByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <ContactInformation />
      </Formik>
    )

    const interpreterField = getByRole('group', {
      name: 'interpreter_required.label',
    })
    const interpreterYes = within(interpreterField).getByLabelText('yes')
    const interpreterNo = within(interpreterField).getByLabelText('no')
    expect(interpreterYes).toHaveAttribute('id', 'interpreter_required.yes')
    expect(interpreterNo).toHaveAttribute('id', 'interpreter_required.no')
    // expect(queryByLabelText('preferred_language.label')).toBeNull() todo: uncomment when values available for conditional

    await user.click(interpreterYes)

    expect(getByLabelText('preferred_language.label')).toBeInTheDocument()

    await user.click(interpreterNo)

    // expect(queryByLabelText('preferred_language.label')).toBeNull() todo: uncomment when conditional is available
  })
})
