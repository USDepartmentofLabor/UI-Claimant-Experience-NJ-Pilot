import { render } from '@testing-library/react'
import AddressVerification, { pageInitialValues } from 'pages/claim/personal'
import { AddressInput, AddressVerificationInput } from 'types/claimantInput'
import { useInitialValues } from 'hooks/useInitialValues'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Address verifications component', () => {
  const makeInitialValues = (
    residence_address: AddressInput,
    LOCAL_mailing_address_same: boolean,
    mailing_address: AddressInput
  ) => {
    return {
      ...pageInitialValues,
      residence_address: residence_address,
      LOCAL_mailing_address_same: LOCAL_mailing_address_same,
      mailing_address: mailing_address,
    }
  }

  const mockClaimantInput = (
    residence_address: AddressInput,
    LOCAL_mailing_address_same: boolean,
    mailing_address: AddressInput
  ) => {
    const initialValues = makeInitialValues(
      residence_address,
      LOCAL_mailing_address_same,
      mailing_address
    )
    ;(useInitialValues as jest.Mock).mockImplementation(
      (values: AddressVerificationInput) => ({
        initialValues: { ...values, ...initialValues },
        isLoading: false,
      })
    )
  }

  const MAILING_ADDRESS = {
    address: '123 Test St',
    address2: 'Unit G',
    city: 'Hoboken',
    state: 'NJ',
    zipcode: '07030',
  }

  const RESIDENTIAL_ADDRESS = {
    address: '456 Test St',
    address2: '',
    city: 'Woodbridge',
    state: 'NJ',
    zipcode: '07001',
  }

  mockClaimantInput(RESIDENTIAL_ADDRESS, true, RESIDENTIAL_ADDRESS)

  it('renders properly without error', () => {
    render(<AddressVerification />)
  })

  it('shows user who does NOT need verification should not see address verification fields', () => {
    render(<AddressVerification />)
  })

  it('shows user who needs verification with same address should see one address selector', () => {
    render(<AddressVerification />)
  })

  mockClaimantInput(RESIDENTIAL_ADDRESS, false, MAILING_ADDRESS)

  it('shows user who needs verification with different address should see two address selectors', () => {
    render(<AddressVerification />)
  })
})
