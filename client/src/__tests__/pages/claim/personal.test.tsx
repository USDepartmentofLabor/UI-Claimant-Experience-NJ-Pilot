import { render, screen, within } from '@testing-library/react'
import Personal from 'pages/claim/personal'
import { PersonalPageDefinition } from 'constants/pages/definitions/personalPageDefinition'
import { ClaimantInput } from 'types/claimantInput'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useInitialValues } from 'hooks/useInitialValues'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Personal information component', () => {
  const initialValues = {
    ...PersonalPageDefinition.initialValues,
    claimant_name: {
      first_name: 'Dori',
      middle_initial: 'D',
      last_name: 'Coxen',
    },
  }

  ;(useInitialValues as jest.Mock).mockImplementation(
    (values: ClaimantInput) => ({
      initialValues: { ...values, ...initialValues },
      isLoading: false,
    })
  )

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

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = Personal
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
