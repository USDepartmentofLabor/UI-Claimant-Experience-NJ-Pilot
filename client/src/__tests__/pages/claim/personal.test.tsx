import { render, screen, within } from '@testing-library/react'
import Personal from 'pages/claim/personal'
import { PersonalPageDefinition } from 'constants/pages/definitions/personalPageDefinition'
import { ClaimantInput } from 'types/claimantInput'
import { useInitialValues } from 'hooks/useInitialValues'
import { WrappingProviders } from 'utils/testUtils'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Personal information component', () => {
  const makeInitialValues = (
    first_name: string | undefined,
    middle_initial: string | undefined,
    last_name: string | undefined
  ) => {
    return {
      ...PersonalPageDefinition.initialValues,
      claimant_name: {
        first_name: first_name,
        middle_initial: middle_initial,
        last_name: last_name,
      },
    }
  }
  const mockClaimantInput = (
    first_name: string | undefined,
    middle_initial: string | undefined,
    last_name: string | undefined
  ) => {
    const initialValues = makeInitialValues(
      first_name,
      middle_initial,
      last_name
    )
    ;(useInitialValues as jest.Mock).mockImplementation(
      (values: ClaimantInput) => ({
        initialValues: { ...values, ...initialValues },
        isLoading: false,
      })
    )
  }

  mockClaimantInput('Dori', 'D', 'Coxen')
  it('renders properly without error', () => {
    render(<Personal />)
    const verifiedFieldsSection = screen.getByTestId('verified-fields')
    const verifiedFields = within(verifiedFieldsSection).getAllByRole(
      'listitem'
    )
    const verifiedLegalName = within(verifiedFieldsSection).getByText(
      'personal.verified_legal_name.label'
    )

    const verifiedLegalNameValue = within(verifiedFieldsSection).getByText(
      'Dori D Coxen'
    )

    const hasAlternateNamesQuestion = screen.getByRole('group', {
      name: 'claimant_has_alternate_names.label',
    })
    const yesAlternateNames = within(hasAlternateNamesQuestion).queryByRole(
      'radio',
      {
        name: 'yes',
      }
    )
    const noAlternateNames = within(hasAlternateNamesQuestion).queryByRole(
      'radio',
      {
        name: 'no',
      }
    )
    const claimantAlternateNames = screen.queryByRole('group', {
      name: 'alternate name',
    })

    const primaryAddress = screen.getByRole('group', {
      name: 'label.primary_address',
    })
    const mailingAddressIsSameCheckbox = screen.getByRole('checkbox', {
      name: 'label.mailing_address_same',
    })
    const mailingAddress = screen.getByRole('group', {
      name: 'label.mailing_address',
    })

    expect(verifiedFieldsSection).toBeInTheDocument()
    expect(verifiedFields).toHaveLength(1)
    expect(verifiedLegalName).toBeInTheDocument()
    expect(verifiedLegalNameValue).toBeInTheDocument()

    expect(yesAlternateNames).toBeInTheDocument()
    expect(yesAlternateNames).not.toBeChecked()
    expect(noAlternateNames).toBeInTheDocument()
    expect(noAlternateNames).not.toBeChecked()
    expect(claimantAlternateNames).not.toBeInTheDocument()

    expect(primaryAddress).toBeInTheDocument()
    expect(mailingAddressIsSameCheckbox).toBeInTheDocument()
    expect(mailingAddress).toBeInTheDocument()
  })

  describe('Missing verified fields', () => {
    it('Does not show verified fields', () => {
      mockClaimantInput(undefined, undefined, undefined)
      render(<Personal />)

      const verifiedFieldsHeading = screen.queryByText(
        'verified_fields.default_heading'
      )
      expect(verifiedFieldsHeading).not.toBeInTheDocument()
    })

    it('Does not include an undefined name field', () => {
      mockClaimantInput('Dori', undefined, 'Coxen')
      render(<Personal />)

      const verifiedFieldsSection = screen.getByTestId('verified-fields')
      expect(verifiedFieldsSection).toBeInTheDocument()
      const verifiedLegalNameValue = within(verifiedFieldsSection).getByText(
        'Dori Coxen'
      )
      expect(verifiedLegalNameValue).toBeInTheDocument()
    })
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = Personal
      expect(Page).toHaveProperty('getLayout')

      render(
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
