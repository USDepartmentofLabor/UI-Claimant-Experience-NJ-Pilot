import { Identity } from 'pages/claim/identity'
import { screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IdentityPageDefinition } from 'constants/pages/definitions/identityPageDefinition'
import { useInitialValues } from 'hooks/useInitialValues'
import { ClaimantInput } from 'types/claimantInput'
import { WrappingProviders } from 'utils/testUtils'

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

  window.open = jest.fn()
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      assign: window.open,
    },
  })

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

    const hasNJIssuedIDQuestion = screen.getByRole('group', {
      name: 'has_nj_issued_id.label',
    })
    const hasNJIssuedIDYesAnswer = within(hasNJIssuedIDQuestion).getByRole(
      'radio',
      { name: 'yes' }
    )
    const hasNJIssuedIDNoAnswer = within(hasNJIssuedIDQuestion).getByRole(
      'radio',
      { name: 'no' }
    )

    const authorizationType = screen.getByRole('group', {
      name: 'work_authorization.authorization_type.label',
    })

    expect(verifiedBirthdateLabel).toBeInTheDocument()
    expect(verifiedBirthdateValue).toBeInTheDocument()

    expect(hasNJIssuedIDYesAnswer).toBeInTheDocument()
    expect(hasNJIssuedIDNoAnswer).toBeInTheDocument()

    expect(authorizationType).toBeInTheDocument()
  })

  it("Clears NJ driver's license or state ID", async () => {
    const user = userEvent.setup()
    render(<Identity />)

    const hasNJIssuedIDQuestion = screen.getByRole('group', {
      name: 'has_nj_issued_id.label',
    })
    const hasNJIssuedIDYesAnswer = within(hasNJIssuedIDQuestion).getByRole(
      'radio',
      { name: 'yes' }
    )
    const hasNJIssuedIDNoAnswer = within(hasNJIssuedIDQuestion).getByRole(
      'radio',
      { name: 'no' }
    )

    // Toggle NJ issued ID 'Yes' to show driver's license or state id text field
    await user.click(hasNJIssuedIDYesAnswer)

    const driversLicenseOrStateIDNumber = screen.getByRole('textbox', {
      name: 'drivers_license_or_state_id_number.label',
    })

    // Input text into driver's license or state id text field
    await userEvent.type(driversLicenseOrStateIDNumber, '1234567890')
    expect(driversLicenseOrStateIDNumber).toHaveValue('1234567890')

    // Toggle NJ issued ID 'No', then 'Yes' to hide and show driver's license or state id text field
    await user.click(hasNJIssuedIDNoAnswer)
    await user.click(hasNJIssuedIDYesAnswer)

    // Check that driver's license or state id text field is cleared
    const driversLicenseOrStateIDNumberReturned = screen.getByRole('textbox', {
      name: 'drivers_license_or_state_id_number.label',
    })
    expect(driversLicenseOrStateIDNumberReturned).toHaveValue('')
  })

  it('Click USCIS/Alien registration number help modal link', async () => {
    const user = userEvent.setup()
    render(<Identity />)

    const authorizationType = screen.getByRole('group', {
      name: 'work_authorization.authorization_type.label',
    })
    const authorizationTypeAuthorizationCard = within(
      authorizationType
    ).getByRole('radio', {
      name: 'work_authorization.authorization_type.options.employment_authorization_or_card_or_doc',
    })

    // Select 'Yes; I have an employment authorization card/document' radio button
    await user.click(authorizationTypeAuthorizationCard)

    // Click USCIS/Alien registration number help link to open modal
    const alienRegistrationNumberLink = screen.getByText(
      'work_authorization.alien_registration_number.hint',
      {
        exact: false,
      }
    )
    await user.click(alienRegistrationNumberLink)

    // Click 'Continue' button to open link and check if it was called
    const alienRegistrationNumberModalContinue = screen.getByText('Continue', {
      exact: false,
    })
    await user.click(alienRegistrationNumberModalContinue)

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(window.open).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(window.open).toHaveBeenCalledWith(
      'https://www.immigrationhelp.org/learning-center/what-is-an-alien-registration-number/'
    )
  })

  it('Fills and clears all fields from employement authorization section', async () => {
    const user = userEvent.setup()
    render(<Identity />)

    const authorizationType = screen.getByRole('group', {
      name: 'work_authorization.authorization_type.label',
    })
    const authorizationTypeUSCitizen = within(authorizationType).getByRole(
      'radio',
      {
        name: 'work_authorization.authorization_type.options.US_citizen_or_national',
      }
    )
    const authorizationTypeAuthorizationCard = within(
      authorizationType
    ).getByRole('radio', {
      name: 'work_authorization.authorization_type.options.employment_authorization_or_card_or_doc',
    })

    // Select 'Yes; I have an employment authorization card/document' radio button
    await user.click(authorizationTypeAuthorizationCard)

    // Input first name, middle initial, last name, and suffix
    const alienFirstName = screen.getByLabelText('first_name.label', {
      exact: false,
    })
    const alienMiddleInitial = screen.getByLabelText('middle_initial.label', {
      exact: false,
    })
    const alienLastName = screen.getByLabelText('last_name.label', {
      exact: false,
    })
    const alienSuffixDropdown = screen.getByLabelText('suffix.label', {
      exact: false,
    })

    await userEvent.type(alienFirstName, 'John')
    expect(alienFirstName).toHaveValue('John')

    await userEvent.type(alienMiddleInitial, 'D')
    expect(alienMiddleInitial).toHaveValue('D')

    await userEvent.type(alienLastName, 'Doe')
    expect(alienLastName).toHaveValue('Doe')

    await user.selectOptions(alienSuffixDropdown, 'I')
    expect(alienSuffixDropdown).toHaveValue('I')

    // Input USCIS/Alien registration number
    const alienRegistrationNumber = screen.getByLabelText(
      'work_authorization.alien_registration_number.label',
      {
        exact: false,
      }
    )
    const reEnterAlienRegistrationNumber = screen.getByLabelText(
      'work_authorization.re_enter_alien_registration_number.label',
      {
        exact: false,
      }
    )

    await userEvent.type(alienRegistrationNumber, '123456789')
    expect(alienRegistrationNumber).toHaveValue('123456789')

    await userEvent.type(reEnterAlienRegistrationNumber, '123456789')
    expect(reEnterAlienRegistrationNumber).toHaveValue('123456789')

    // Select country of origin
    const countryOfOriginDropdown = screen.getByLabelText(
      'country_of_origin.label',
      {
        exact: false,
      }
    )

    await user.selectOptions(countryOfOriginDropdown, 'Anguilla')
    expect(countryOfOriginDropdown).toHaveValue('Anguilla')

    // Input employment valid from / issued on and expiration date
    const queryForAuthorizationCardValidParent = () =>
      screen.getByTestId('employment_authorization_start_date.parent-div')

    const getMonthAuthorizationCardValid = () =>
      within(queryForAuthorizationCardValidParent()).getByRole('textbox', {
        name: /month/i,
      })
    const getDayAuthorizationCardValid = () =>
      within(queryForAuthorizationCardValidParent()).getByRole('textbox', {
        name: /day/i,
      })
    const getYearAuthorizationCardValid = () =>
      within(queryForAuthorizationCardValidParent()).getByRole('textbox', {
        name: /year/i,
      })

    const authorizationCardValidDayField = getDayAuthorizationCardValid()
    const authorizationCardValidMonthField = getMonthAuthorizationCardValid()
    const authorizationCardValidYearField = getYearAuthorizationCardValid()

    await user.type(authorizationCardValidDayField, '01')
    await user.type(authorizationCardValidMonthField, '06')
    await user.type(authorizationCardValidYearField, '2023')

    expect(authorizationCardValidDayField).toHaveValue('01')
    expect(authorizationCardValidMonthField).toHaveValue('06')
    expect(authorizationCardValidYearField).toHaveValue('2023')

    // Toggle 'Yes; I am a U.S. citizen/national' and 'Yes; I have an employment authorization card/document' radio buttons
    await user.click(authorizationTypeUSCitizen)
    await user.click(authorizationTypeAuthorizationCard)

    // Expect all filled fields before to be empty
    const alienFirstNameReturned = screen.getByLabelText('first_name.label', {
      exact: false,
    })
    const alienMiddleInitialReturned = screen.getByLabelText(
      'middle_initial.label',
      {
        exact: false,
      }
    )
    const alienLastNameReturned = screen.getByLabelText('last_name.label', {
      exact: false,
    })
    const alienSuffixDropdownReturned = screen.getByLabelText('suffix.label', {
      exact: false,
    })

    const alienRegistrationNumberReturned = screen.getByLabelText(
      'work_authorization.alien_registration_number.label',
      {
        exact: false,
      }
    )
    const reEnterAlienRegistrationNumberReturned = screen.getByLabelText(
      'work_authorization.re_enter_alien_registration_number.label',
      {
        exact: false,
      }
    )
    const countryOfOriginDropdownReturned = screen.getByLabelText(
      'country_of_origin.label',
      {
        exact: false,
      }
    )

    const authorizationCardValidDayFieldReturned =
      getDayAuthorizationCardValid()
    const authorizationCardValidMonthFieldReturned =
      getMonthAuthorizationCardValid()
    const authorizationCardValidYearFieldReturned =
      getYearAuthorizationCardValid()

    expect(alienFirstNameReturned).toHaveValue('')
    expect(alienMiddleInitialReturned).toHaveValue('')
    expect(alienLastNameReturned).toHaveValue('')
    expect(alienSuffixDropdownReturned).toHaveValue('')
    expect(alienRegistrationNumberReturned).toHaveValue('')
    expect(reEnterAlienRegistrationNumberReturned).toHaveValue('')
    expect(countryOfOriginDropdownReturned).toHaveValue('')
    expect(authorizationCardValidDayFieldReturned).toHaveValue('')
    expect(authorizationCardValidMonthFieldReturned).toHaveValue('')
    expect(authorizationCardValidYearFieldReturned).toHaveValue('')
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
      const ssn = within(verifiedFieldsSection).getByText('privacy')
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
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
