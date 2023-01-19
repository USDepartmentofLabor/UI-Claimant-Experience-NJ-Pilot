import { Identity } from 'pages/claim/identity'
import { screen, render, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IdentityPageDefinition } from 'constants/pages/definitions/identityPageDefinition'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useInitialValues } from 'hooks/useInitialValues'
import { ClaimantInput } from 'types/claimantInput'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Identity Information Page', () => {
  const makeInitialValues = (
    birthDate: string | undefined,
    ssn: string | undefined
  ) => {
    return {
      ...IdentityPageDefinition.initialValues,
      birthdate: birthDate,
      ssn: ssn,
    }
  }

  const mockClaimantInput = (
    birthDate: string | undefined,
    ssn: string | undefined
  ) => {
    const initialValues = makeInitialValues(birthDate, ssn)

    ;(useInitialValues as jest.Mock).mockImplementation(
      (values: ClaimantInput) => ({
        initialValues: { ...values, ...initialValues },
        isLoading: false,
      })
    )
  }
  const birthdate = '1980-07-31'
  const displayedBirthdate = 'July 31, 1980'
  mockClaimantInput(birthdate, undefined)
  it('renders properly', () => {
    render(<Identity />)

    const verifiedFieldsSection = screen.getByTestId('verified-fields')

    const verifiedBirthdateLabel = within(verifiedFieldsSection).getByText(
      'birthdate.label'
    )
    const verifiedBirthdateValue = within(verifiedFieldsSection).getByText(
      displayedBirthdate
    )
    const idNumber = screen.queryByLabelText(
      'drivers_license_or_state_id_number.label'
    )
    const authorizedToWorkInUSRadioGroup = screen.getByRole('group', {
      name: 'work_authorization.authorized_to_work.label',
    })
    const yesAuthorizedToWorkInUS = within(
      authorizedToWorkInUSRadioGroup
    ).queryByLabelText('yes')
    const noAuthorizedToWorkInUS = within(
      authorizedToWorkInUSRadioGroup
    ).queryByLabelText('no')

    expect(verifiedBirthdateLabel).toBeInTheDocument()
    expect(verifiedBirthdateValue).toBeInTheDocument()

    expect(idNumber).toBeInTheDocument()
    expect(yesAuthorizedToWorkInUS).toBeInTheDocument()
    expect(noAuthorizedToWorkInUS).toBeInTheDocument()
  })

  it('hides and shows explanation field', async () => {
    const user = userEvent.setup()
    render(<Identity />)

    const authorizedToWorkInUSRadioGroup = screen.getByRole('group', {
      name: 'work_authorization.authorized_to_work.label',
    })
    const yesAuthorizedToWorkInUS = within(
      authorizedToWorkInUSRadioGroup
    ).getByLabelText('yes')
    const noAuthorizedToWorkInUS = within(
      authorizedToWorkInUSRadioGroup
    ).getByLabelText('no')

    expect(yesAuthorizedToWorkInUS).toBeInTheDocument()
    expect(noAuthorizedToWorkInUS).toBeInTheDocument()
    // Field is hidden
    expect(
      screen.queryByLabelText(
        'work_authorization.not_authorized_to_work_explanation.label'
      )
    ).not.toBeInTheDocument()

    // Toggle field to show up
    await user.click(noAuthorizedToWorkInUS)
    const notAllowedToWorkInUSExplanationField = await screen.findByLabelText(
      'work_authorization.not_authorized_to_work_explanation.label'
    )
    expect(notAllowedToWorkInUSExplanationField).toBeInTheDocument()

    // Toggle field to hidden
    await user.click(yesAuthorizedToWorkInUS)
    await waitFor(() => {
      expect(notAllowedToWorkInUSExplanationField).not.toBeInTheDocument()
    })
  })

  it('hides and shows work authorization fields', async () => {
    const user = userEvent.setup()

    render(<Identity />)

    const authorizedToWorkInUSRadioGroup = screen.getByRole('group', {
      name: 'work_authorization.authorized_to_work.label',
    })
    const yesAuthorizedToWorkInUS = within(
      authorizedToWorkInUSRadioGroup
    ).getByLabelText('yes')
    const noAuthorizedToWorkInUS = within(
      authorizedToWorkInUSRadioGroup
    ).getByLabelText('no')

    expect(yesAuthorizedToWorkInUS).toBeInTheDocument()
    expect(noAuthorizedToWorkInUS).toBeInTheDocument()

    // Dropdown is hidden
    expect(
      screen.queryByLabelText('work_authorization.authorization_type.label')
    ).not.toBeInTheDocument()

    // Toggle the field to show up
    await user.click(yesAuthorizedToWorkInUS)
    const authorizationTypeDropdown = await screen.findByLabelText(
      'work_authorization.authorization_type.label'
    )
    const usCitizenOption = within(authorizationTypeDropdown).getByText(
      'work_authorization.authorization_type.options.US_citizen_or_national'
    )
    const permanentResidentOption = within(authorizationTypeDropdown).getByText(
      'work_authorization.authorization_type.options.permanent_resident'
    )
    const temporaryLegalWorkerOption = within(
      authorizationTypeDropdown
    ).getByText(
      'work_authorization.authorization_type.options.temporary_legal_worker'
    )

    expect(usCitizenOption).toBeInTheDocument()
    expect(permanentResidentOption).toBeInTheDocument()
    expect(temporaryLegalWorkerOption).toBeInTheDocument()

    // Field is hidden
    expect(
      screen.queryByLabelText(
        'work_authorization.alien_registration_number.label'
      )
    ).not.toBeInTheDocument()

    // Field stays hidden
    await user.selectOptions(authorizationTypeDropdown, usCitizenOption)
    expect(
      screen.queryByLabelText(
        'work_authorization.alien_registration_number.label'
      )
    ).not.toBeInTheDocument()

    // Toggle field to show up
    await user.selectOptions(authorizationTypeDropdown, permanentResidentOption)
    const alienRegistrationNumberField = await screen.findByLabelText(
      'work_authorization.alien_registration_number.label'
    )
    expect(alienRegistrationNumberField).toBeInTheDocument()

    // Field stays shown for this option
    await user.selectOptions(
      authorizationTypeDropdown,
      temporaryLegalWorkerOption
    )
    expect(alienRegistrationNumberField).toBeInTheDocument()

    // Toggle field and dropdown to hidden
    await user.click(noAuthorizedToWorkInUS)
    await waitFor(() => {
      expect(authorizationTypeDropdown).not.toBeInTheDocument()
      expect(alienRegistrationNumberField).not.toBeInTheDocument()
    })
  })
  describe('verified fields', () => {
    it('does not show ssn', () => {
      render(<Identity />)
      const verifiedFieldsSection = screen.getByTestId('verified-fields')
      const verifiedFields = within(verifiedFieldsSection).getAllByRole(
        'listitem'
      )
      const birthDate = within(verifiedFieldsSection).getByText(
        'birthdate.label'
      )
      expect(verifiedFields.length).toBe(1)
      expect(birthDate).toBeInTheDocument()
    })

    it('shows ssn', () => {
      mockClaimantInput(birthdate, '123-12-1234')
      render(<Identity />)
      const verifiedFieldsSection = screen.getByTestId('verified-fields')
      const verifiedFields = within(verifiedFieldsSection).getAllByRole(
        'listitem'
      )
      const ssn = within(verifiedFieldsSection).getByText('123-12-1234')
      expect(verifiedFields.length).toBe(2)
      expect(ssn).toBeInTheDocument()
    })
    it('does not show verified fields box', () => {
      mockClaimantInput(undefined, undefined)
      render(<Identity />)
      const verifiedFieldsHeading = screen.queryByText(
        'verified_fields.default_heading'
      )
      expect(verifiedFieldsHeading).not.toBeInTheDocument()
    })
  })
  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = Identity
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
