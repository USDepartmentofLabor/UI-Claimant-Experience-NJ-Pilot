import { screen, render, within } from '@testing-library/react'
import Contact from 'pages/claim/contact'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useInitialValues } from 'hooks/useInitialValues'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Contact page', () => {
  const initialValues = {
    email: 'boy_who_lived@hogwarts.com',
    claimant_phone: { number: '2028675309', sms: undefined },
    alternate_phone: { number: '', sms: undefined },
    interpreter_required: undefined,
    preferred_language: undefined,
    preferred_language_other: undefined,
  }
  ;(useInitialValues as jest.Mock).mockImplementation((values) => ({
    initialValues: { ...values, ...initialValues },
    isLoading: false,
  }))

  it('renders properly', () => {
    render(<Contact />)

    const verifiedFieldsSection = screen.getByTestId('verified-fields')
    const verifiedFields = within(verifiedFieldsSection).getAllByRole(
      'listitem'
    )
    const verifiedEmailAddress = within(verifiedFieldsSection).getByText(
      'email.label'
    )
    const verifiedEmailAddressValue = within(verifiedFieldsSection).getByText(
      'boy_who_lived@hogwarts.com'
    )
    const verifiedPhoneNumber = within(verifiedFieldsSection).getByText(
      'claimant_phone.label'
    )
    const verifiedPhoneNumberValue = within(verifiedFieldsSection).getByText(
      '202-867-5309'
    )
    expect(verifiedFieldsSection).toBeInTheDocument()
    expect(verifiedFields).toHaveLength(2)
    expect(verifiedEmailAddress).toBeInTheDocument()
    expect(verifiedEmailAddressValue).toBeInTheDocument()
    expect(verifiedPhoneNumber).toBeInTheDocument()
    expect(verifiedPhoneNumberValue).toBeInTheDocument()

    const claimantPhone = screen.getByRole('textbox', {
      name: 'claimant_phone.label',
    })
    expect(claimantPhone).toHaveAttribute('id', 'claimant_phone.number')

    const sms = screen.getByText('sms.label')
    expect(sms).not.toBeChecked()

    const altPhone = screen.getByRole('textbox', {
      name: 'alternate_phone.label',
    })
    expect(altPhone).toHaveAttribute('id', 'alternate_phone.number')

    const interpreterYes = screen.getByLabelText(
      'interpreter_required.options.interpreter'
    )
    const interpreterNo = screen.getByLabelText(
      'interpreter_required.options.no_interpreter_tty'
    )
    expect(interpreterYes).not.toBeChecked()
    expect(interpreterNo).not.toBeChecked()
  })

  it('conditionally displays preferred language', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const interpreterYes = screen.getByLabelText(
      'interpreter_required.options.interpreter'
    )
    const interpreterNo = screen.getByLabelText(
      'interpreter_required.options.no_interpreter_tty'
    )
    expect(interpreterYes).not.toBeChecked()
    expect(screen.queryByLabelText('preferred_language.label')).toBeNull()

    await user.click(interpreterYes)
    expect(interpreterYes).toBeChecked()

    await user.click(interpreterNo)
    expect(interpreterNo).toBeChecked()
    expect(interpreterYes).not.toBeChecked()
    expect(screen.queryByLabelText('preferred_language.label')).toBeNull()
  })

  it('Allows selection of preferred language', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const interpreterYes = screen.getByLabelText(
      'interpreter_required.options.interpreter'
    )
    expect(screen.queryByLabelText('preferred_language.label')).toBeNull()

    await user.click(interpreterYes)
    expect(interpreterYes).toBeChecked()

    const languageMandarin = screen.getByLabelText(
      'preferred_language.options.mandarin'
    )
    const languageOther = screen.getByLabelText(
      'preferred_language.options.other'
    )

    await user.click(languageMandarin)
    expect(languageMandarin).toBeChecked()

    await user.click(languageOther)
    expect(languageOther).toBeChecked()

    const preferredOtherLanguage = screen.getByLabelText('other_language', {
      exact: false,
    })

    await user.type(preferredOtherLanguage, 'Japanese')
    expect(languageMandarin).not.toBeChecked()

    await user.click(languageMandarin)
    expect(languageOther).not.toBeChecked()

    await user.click(languageOther)
    expect(screen.queryByLabelText('other_language')).toHaveTextContent('')
  })
  describe('Verified fields', () => {
    it('Autofills the phone number value', async () => {
      const initialValuesWithPhoneOnly = {
        email: undefined,
        claimant_phone: { number: '2028675309', sms: undefined },
        alternate_phone: { number: '', sms: undefined },
        interpreter_required: undefined,
        preferred_language: undefined,
        preferred_language_other: undefined,
      }
      ;(useInitialValues as jest.Mock).mockImplementation((values) => ({
        initialValues: { ...values, ...initialValuesWithPhoneOnly },
        isLoading: false,
      }))

      render(<Contact />)
      const phone = screen.getByRole('textbox', {
        name: 'claimant_phone.label',
      })
      const email = screen.queryByText('email.label')

      await expect(phone).toHaveValue('2028675309')
      await expect(email).not.toBeInTheDocument()
    })
    it('Verified box does not show if missing all data', async () => {
      const initialValuesMissingAllFields = {
        email: undefined,
        claimant_phone: { number: undefined, sms: undefined },
        alternate_phone: { number: '', sms: undefined },
        interpreter_required: undefined,
        preferred_language: undefined,
        preferred_language_other: undefined,
      }
      ;(useInitialValues as jest.Mock).mockImplementation((values) => ({
        initialValues: { ...values, ...initialValuesMissingAllFields },
        isLoading: false,
      }))
      render(<Contact />)
      const verifiedFieldsHeading = screen.queryByText(
        'verified_fields.default_heading'
      )
      expect(verifiedFieldsHeading).not.toBeInTheDocument()
    })
  })
  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = Contact
      expect(Page).toHaveProperty('getLayout')

      render(
        <QueryClientProvider client={new QueryClient()}>
          {Page.getLayout?.(<Page />)}
        </QueryClientProvider>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
