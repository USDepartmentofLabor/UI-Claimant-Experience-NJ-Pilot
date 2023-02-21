import { render, screen } from '@testing-library/react'
import { ContactReview } from 'components/review/sections/ContactReview/ContactReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import {
  InterpreterTTYOption,
  PreferredLanguageOption,
  UNTOUCHED_RADIO_VALUE,
} from 'constants/formOptions'

describe('ContactReview component', () => {
  const renderContactReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <ContactReview />
      </ClaimFormContext.Provider>
    )

    const claimant_phone = screen.queryByRole('group', {
      name: 'contact.claimant_phone.label',
    })
    const sms = screen.queryByRole('group', {
      name: 'contact.sms.label',
    })
    const alternate_phone = screen.queryByRole('group', {
      name: 'contact.alternate_phone.label',
    })
    const email = screen.queryByRole('group', {
      name: 'contact.email.label',
    })
    const interpreter_required = screen.queryByRole('group', {
      name: 'contact.interpreter_required.label',
    })
    const preferred_language = screen.queryByRole('group', {
      name: 'contact.preferred_language.label',
    })
    const preferred_language_other = screen.queryByRole('group', {
      name: 'contact.other_language',
      exact: false,
    })

    return {
      claimant_phone,
      sms,
      alternate_phone,
      email,
      interpreter_required,
      preferred_language,
      preferred_language_other,
    }
  }

  it('renders correctly', () => {
    const values = {
      claimant_phone: {
        number: '123-456-7890',
        sms: true,
      },
      alternate_phone: {
        number: '555-555-5555',
        sms: UNTOUCHED_RADIO_VALUE,
      },
      email: 'test@test.com',
      interpreter_required: 'interpreter' as InterpreterTTYOption,
      preferred_language: 'other' as PreferredLanguageOption,
      preferred_language_other: 'Japanese',
    }

    const {
      claimant_phone,
      sms,
      alternate_phone,
      email,
      interpreter_required,
      preferred_language,
      preferred_language_other,
    } = renderContactReview(values)

    expect(claimant_phone).toHaveTextContent(values.claimant_phone.number)
    expect(sms).toHaveTextContent('yes')
    expect(alternate_phone).toHaveTextContent(values.alternate_phone.number)
    expect(email).toHaveTextContent(values.email)
    expect(interpreter_required).toHaveTextContent(values.interpreter_required)
    expect(preferred_language).toHaveTextContent(values.preferred_language)
    expect(preferred_language_other).toHaveTextContent(
      values.preferred_language_other
    )
  })

  it('does not show alt phone number, preferred language, and preferred language other based on answers', () => {
    const values: ClaimantInput = {
      alternate_phone: { number: '', sms: UNTOUCHED_RADIO_VALUE },
      interpreter_required: 'no_interpreter_tty' as InterpreterTTYOption,
      preferred_language: UNTOUCHED_RADIO_VALUE,
      preferred_language_other: '',
    }

    const {
      alternate_phone,
      interpreter_required,
      preferred_language,
      preferred_language_other,
    } = renderContactReview(values)

    expect(alternate_phone).not.toBeInTheDocument()

    expect(interpreter_required).toBeInTheDocument()
    expect(interpreter_required).toHaveTextContent(
      values.interpreter_required as string
    )

    expect(preferred_language).not.toBeInTheDocument()
    expect(preferred_language_other).not.toBeInTheDocument()
  })
})
