import { render, screen } from '@testing-library/react'
import { IdentityReview } from 'components/review/sections/IdentityReview/IdentityReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import {
  AuthorizationTypeOption,
  CountryOfOriginOption,
  SuffixOption,
} from 'constants/formOptions'
import { formatStoredDateToDisplayDate } from 'utils/date/format'

describe('IdentityReview component', () => {
  const renderIdentityReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <IdentityReview />
      </ClaimFormContext.Provider>
    )

    const ssn = screen.queryAllByRole('group', {
      name: 'label',
    })
    const dob = screen.queryAllByRole('group', {
      name: 'birthdate.label',
    })
    const hasNJIssuedId = screen.queryAllByRole('group', {
      name: 'has_nj_issued_id.label',
    })
    const driversLicenseOrStateId = screen.queryAllByRole('group', {
      name: 'drivers_license_or_state_id_number.label',
    })
    const authorizationType = screen.queryByRole('group', {
      name: 'work_authorization.authorization_type.label',
    })
    const firstNames = screen.queryAllByRole('group', {
      name: 'name.first_name.label',
    })
    const middleInitials = screen.queryAllByRole('group', {
      name: 'name.middle_initial.label',
    })
    const lastNames = screen.queryAllByRole('group', {
      name: 'name.last_name.label',
    })
    const suffixes = screen.queryAllByRole('group', {
      name: 'name.suffix.label',
    })
    const alientRegistrationNumber = screen.queryAllByRole('group', {
      name: 'work_authorization.alien_registration_number.label',
    })
    const countryOfOrigin = screen.queryAllByRole('group', {
      name: 'work_authorization.country_of_origin.label',
    })
    const authorizationStartDate = screen.queryAllByRole('group', {
      name: 'work_authorization.employment_authorization_start_date.label',
    })
    const authorizationEndDate = screen.queryAllByRole('group', {
      name: 'work_authorization.employment_authorization_end_date.label',
    })

    return {
      ssn,
      dob,
      hasNJIssuedId,
      driversLicenseOrStateId,
      authorizationType,
      firstNames,
      middleInitials,
      lastNames,
      suffixes,
      alientRegistrationNumber,
      countryOfOrigin,
      authorizationStartDate,
      authorizationEndDate,
    }
  }

  it('renders correctly', () => {
    const values = {
      ssn: '123-45-6789',
      birthdate: '2021-04-01',
      has_nj_issued_id: true,
      drivers_license_or_state_id_number: 'D12345678901234',
      authorization_type: 'permanent_resident' as AuthorizationTypeOption,
      employment_authorization_document_name: {
        first_name: 'test',
        middle_initial: 'm',
        last_name: 'testerson',
        suffix: 'II' as SuffixOption,
      },
      alien_registration_number: '001234567',
      country_of_origin: 'Canada' as CountryOfOriginOption,
      employment_authorization_start_date: '2021-04-01',
      employment_authorization_end_date: '2022-04-01',
    }

    const {
      ssn,
      dob,
      hasNJIssuedId,
      driversLicenseOrStateId,
      authorizationType,
      firstNames,
      middleInitials,
      lastNames,
      suffixes,
      alientRegistrationNumber,
      countryOfOrigin,
      authorizationStartDate,
      authorizationEndDate,
    } = renderIdentityReview(values)

    expect(ssn[0]).toHaveTextContent('•••••••••••')
    expect(dob[0]).toHaveTextContent(
      formatStoredDateToDisplayDate(values.birthdate) as string
    )
    expect(hasNJIssuedId[0]).toHaveTextContent('yes')
    expect(driversLicenseOrStateId[0]).toHaveTextContent(
      values.drivers_license_or_state_id_number
    )
    expect(authorizationType).toHaveTextContent(values.authorization_type)

    expect(firstNames[0]).toHaveTextContent(
      values.employment_authorization_document_name.first_name
    )
    expect(middleInitials[0]).toHaveTextContent(
      values.employment_authorization_document_name.middle_initial
    )
    expect(lastNames[0]).toHaveTextContent(
      values.employment_authorization_document_name.last_name
    )
    expect(suffixes[0]).toHaveTextContent(
      values.employment_authorization_document_name.suffix
    )
    expect(alientRegistrationNumber[0]).toHaveTextContent(
      values.alien_registration_number
    )
    expect(countryOfOrigin[0]).toHaveTextContent(values.country_of_origin)
    expect(authorizationStartDate[0]).toHaveTextContent(
      formatStoredDateToDisplayDate(
        values.employment_authorization_start_date
      ) as string
    )
    expect(authorizationEndDate[0]).toHaveTextContent(
      formatStoredDateToDisplayDate(
        values.employment_authorization_end_date
      ) as string
    )
  })

  it('does not show drivers license or state id field when claimant indicated they do not have one', () => {
    const values = {
      ssn: '123-45-6789',
      birthdate: '2021-04-01',
      has_nj_issued_id: false,
      authorization_type: 'US_citizen_or_national' as AuthorizationTypeOption,
    }
    const {
      ssn,
      dob,
      hasNJIssuedId,
      driversLicenseOrStateId,
      authorizationType,
    } = renderIdentityReview(values)

    expect(ssn[0]).toBeInTheDocument()
    expect(dob[0]).toBeInTheDocument()
    expect(hasNJIssuedId[0]).toBeInTheDocument()
    expect(driversLicenseOrStateId.length).toBe(0)
    expect(authorizationType).toBeInTheDocument()
  })

  it('does not show employment authorization date fields when claimant indicated they do not have an employment authorization card', () => {
    const values = {
      ssn: '123-45-6789',
      birthdate: '2021-04-01',
      has_nj_issued_id: false,
      authorization_type:
        'not_legally_allowed_to_work_in_US' as AuthorizationTypeOption,
    }
    const {
      ssn,
      dob,
      hasNJIssuedId,
      driversLicenseOrStateId,
      authorizationType,
      authorizationStartDate,
      authorizationEndDate,
    } = renderIdentityReview(values)

    expect(ssn[0]).toBeInTheDocument()
    expect(dob[0]).toBeInTheDocument()
    expect(hasNJIssuedId[0]).toBeInTheDocument()
    expect(driversLicenseOrStateId.length).toBe(0)
    expect(authorizationType).toBeInTheDocument()
    expect(authorizationStartDate.length).toBe(0)
    expect(authorizationEndDate.length).toBe(0)
  })

  it('does not show alien registration info when claimant indicated they are US citizen/national', () => {
    const values = {
      ssn: '123-45-6789',
      birthdate: '2021-04-01',
      has_nj_issued_id: true,
      drivers_license_or_state_id_number: 'D12345678901234',
      authorization_type: 'US_citizen_or_national' as AuthorizationTypeOption,
    }

    const {
      ssn,
      dob,
      hasNJIssuedId,
      driversLicenseOrStateId,
      authorizationType,
      firstNames,
      middleInitials,
      lastNames,
      suffixes,
      alientRegistrationNumber,
      countryOfOrigin,
    } = renderIdentityReview(values)

    expect(ssn[0]).toBeInTheDocument()
    expect(dob[0]).toBeInTheDocument()
    expect(hasNJIssuedId[0]).toBeInTheDocument()
    expect(driversLicenseOrStateId[0]).toBeInTheDocument()
    expect(authorizationType).toBeInTheDocument()

    expect(firstNames.length).toBe(0)
    expect(middleInitials.length).toBe(0)
    expect(lastNames.length).toBe(0)
    expect(suffixes.length).toBe(0)
    expect(alientRegistrationNumber.length).toBe(0)
    expect(countryOfOrigin.length).toBe(0)
  })
})
