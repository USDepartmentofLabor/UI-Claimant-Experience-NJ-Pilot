import { render, screen } from '@testing-library/react'
import AddressVerification, {
  pageInitialValues,
} from 'pages/claim/address-verification'
import { AddressInput, AddressVerificationInput } from 'types/claimantInput'
import { useInitialValues } from 'hooks/useInitialValues'
import { AddressVerificationResponse } from '../../../services/Accumail'
import { useVerifiedAddress } from '../../../queries/useVerifiedAddress'
import { CORRECTED_ADDRESS } from '../../../constants/api/services/verifyAddress'
import { QueryClient, QueryClientProvider } from 'react-query'
import userEvent from '@testing-library/user-event'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')
jest.mock('queries/useVerifiedAddress')

const makeInitialValues = (
  residence_address: AddressInput,
  LOCAL_mailing_address_same: boolean,
  mailing_address: AddressInput,
  LOCAL_residence_address_verification_selection: string,
  LOCAL_mailing_address_verification_selection: string
) => {
  return {
    ...pageInitialValues,
    residence_address: residence_address,
    LOCAL_mailing_address_same: LOCAL_mailing_address_same,
    mailing_address: mailing_address,
    LOCAL_mailing_address_verification_selection: 'AS_ENTERED',
    LOCAL_residence_address_verification_selection: 'AS_ENTERED',
  }
}
const MAILING_ADDRESS = {
  address: '123 Test St',
  address2: '',
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

const validVerificationResponse = {
  address: RESIDENTIAL_ADDRESS,
  validationSummary: CORRECTED_ADDRESS,
} as AddressVerificationResponse

const mockClaimantInput = (
  residence_address: AddressInput,
  LOCAL_mailing_address_same: boolean,
  mailing_address: AddressInput,
  LOCAL_residence_address_verification_selection: string,
  LOCAL_mailing_address_verification_selection: string
) => {
  const initialValues = makeInitialValues(
    residence_address,
    LOCAL_mailing_address_same,
    mailing_address,
    LOCAL_residence_address_verification_selection,
    LOCAL_mailing_address_verification_selection
  )
  ;(useInitialValues as jest.Mock).mockImplementation(
    (values: AddressVerificationInput) => ({
      initialValues: { ...values, ...initialValues },
      isLoading: false,
    })
  )
}

const mockUseVerifiedAddress = useVerifiedAddress as jest.Mock

describe('Address Confirmation Page', () => {
  const renderAddressVerification = (hookReturn?: {
    isLoading: boolean
    isError: boolean
    data: AddressVerificationResponse
  }) => {
    if (hookReturn) {
      mockUseVerifiedAddress.mockReturnValue(hookReturn)
    }

    render(
      <QueryClientProvider client={new QueryClient()}>
        <AddressVerification />
      </QueryClientProvider>
    )
  }

  it('renders properly without error and should only render residential address selector', () => {
    mockClaimantInput(
      RESIDENTIAL_ADDRESS,
      true,
      RESIDENTIAL_ADDRESS,
      'AS_ENTERED',
      'AS_ENTERED'
    )
    renderAddressVerification({
      isError: false,
      isLoading: false,
      data: validVerificationResponse,
    })
    expect(screen.getByText('Address confirmation')).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.legend.residence')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('address_verification.legend.mailing')
    ).not.toBeInTheDocument()
  })

  it('clicking on the AS_VERIFIED option for residence changes both the mailing and residence addresses', () => {
    mockClaimantInput(
      RESIDENTIAL_ADDRESS,
      true,
      RESIDENTIAL_ADDRESS,
      'AS_ENTERED',
      'AS_ENTERED'
    )
    renderAddressVerification({
      isError: false,
      isLoading: false,
      data: validVerificationResponse,
    })
    userEvent.click(
      screen.getByTestId(
        'LOCAL_residence_address_verification_selection.AS_VERIFIED'
      )
    )
    //TODO MRH determine how to tell if the value changed
    screen.debug()
  })

  it('shows user who needs verification with different address should see two address selectors', () => {
    //note different residential and mailing addresses
    mockClaimantInput(
      RESIDENTIAL_ADDRESS,
      false,
      MAILING_ADDRESS,
      'AS_ENTERED',
      'AS_ENTERED'
    )
    renderAddressVerification({
      isError: false,
      isLoading: false,
      data: validVerificationResponse,
    })
    expect(screen.getByText('Address confirmation')).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.legend.residence')
    ).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.legend.mailing')
    ).toBeInTheDocument()
    screen.debug()
  })

  it('clicking on the AS_VERIFIED option for mailing changes only the mailing address', () => {
    //note different residential and mailing addresses
    mockClaimantInput(
      RESIDENTIAL_ADDRESS,
      false,
      MAILING_ADDRESS,
      'AS_ENTERED',
      'AS_ENTERED'
    )
    renderAddressVerification({
      isError: false,
      isLoading: false,
      data: validVerificationResponse,
    })
    userEvent.click(
      screen.getByTestId(
        'LOCAL_mailing_address_verification_selection.AS_VERIFIED'
      )
    )
    //TODO MRH determine how to tell if the value changed
    //resi same
    //mailing changed
    screen.debug()
  })

  //spinner
  it('renders spinner when loading', async () => {
    mockClaimantInput(
      RESIDENTIAL_ADDRESS,
      true,
      RESIDENTIAL_ADDRESS,
      'AS_ENTERED',
      'AS_ENTERED'
    )
    renderAddressVerification({
      isError: false,
      isLoading: true,
      data: validVerificationResponse,
    })
    expect(
      await screen.findByTestId('address-verification-spinner')
    ).toBeInTheDocument()
  })

  //no match - test case for when error states are implemented

  //no match for either - test case for when error states are implemented
})
