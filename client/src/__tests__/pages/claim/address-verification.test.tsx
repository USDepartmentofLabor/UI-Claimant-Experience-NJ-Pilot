import { render, screen } from '@testing-library/react'
import AddressVerification, {
  pageInitialValues,
} from 'pages/claim/address-verification'
import { AddressInput } from 'types/claimantInput'
import { useInitialValues } from 'hooks/useInitialValues'
import { AddressVerificationResponse } from '../../../services/Accumail'
import { useVerifiedAddress } from '../../../queries/useVerifiedAddress'
import {
  CORRECTED_ADDRESS,
  NO_ADDRESS_MATCH,
} from '../../../constants/api/services/verifyAddress'
import { QueryClient, QueryClientProvider } from 'react-query'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'
import { noop } from '../../../helpers/noop/noop'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')
jest.mock('queries/useVerifiedAddress')

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
    LOCAL_residence_address_verification_selection: 'AS_ENTERED',
    LOCAL_mailing_address_verification_selection: 'AS_ENTERED',
  }
}
const MAILING_ADDRESS = {
  address: '123 Test St',
  address2: 'Unit 2B',
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
const validResidenceVerificationResponse = {
  address: RESIDENTIAL_ADDRESS,
  validationSummary: CORRECTED_ADDRESS,
}
const validMailingVerificationResponse = {
  address: MAILING_ADDRESS,
  validationSummary: CORRECTED_ADDRESS,
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
  ;(useInitialValues as jest.Mock).mockImplementation(() => ({
    initialValues,
    isLoading: false,
  }))
}
const mockAppendAndSaveClaimFormValues = jest.fn(async () => Promise.resolve())
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    appendAndSaveClaimFormValues: mockAppendAndSaveClaimFormValues,
  }),
}))
const mockUseVerifiedAddress = useVerifiedAddress as jest.MockedFunction<
  typeof useVerifiedAddress
>
function mockVerifiedAddressQuery(returnValues?: {
  isLoading?: boolean
  isError?: boolean
  data?: AddressVerificationResponse
}) {
  const mockReturnValue = returnValues ?? {
    isLoading: false,
    isError: false,
    data: undefined,
  }
  mockUseVerifiedAddress.mockReturnValue(
    mockReturnValue as ReturnType<typeof useVerifiedAddress>
  )
}

describe('Address Confirmation Page', () => {
  const renderAddressVerification = () => {
    render(
      <Formik initialValues={pageInitialValues} onSubmit={noop}>
        <QueryClientProvider client={new QueryClient()}>
          <AddressVerification />
        </QueryClientProvider>
      </Formik>
    )
  }

  it('renders properly without error and should only render residential address selector', () => {
    mockClaimantInput(RESIDENTIAL_ADDRESS, true, RESIDENTIAL_ADDRESS)
    mockVerifiedAddressQuery({
      isError: false,
      isLoading: false,
      data: validResidenceVerificationResponse,
    })
    renderAddressVerification()
    expect(screen.getByText('Address confirmation')).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.legend.residence')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('address_verification.legend.mailing')
    ).not.toBeInTheDocument()
  })

  it('clicking on the AS_VERIFIED option for residence changes both the mailing and residence addresses', async () => {
    mockClaimantInput(RESIDENTIAL_ADDRESS, true, RESIDENTIAL_ADDRESS)
    mockVerifiedAddressQuery({
      isError: false,
      isLoading: false,
      data: validResidenceVerificationResponse,
    })
    renderAddressVerification()
    await userEvent.click(
      screen.getByTestId(
        'LOCAL_residence_address_verification_selection.AS_VERIFIED'
      )
    )
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith(
      expect.objectContaining({
        residence_address: RESIDENTIAL_ADDRESS,
        mailing_address: RESIDENTIAL_ADDRESS,
      })
    )
  })

  it('shows user who needs verification with different address should see two address selectors', () => {
    //note different residential and mailing addresses
    mockClaimantInput(RESIDENTIAL_ADDRESS, false, MAILING_ADDRESS)
    mockVerifiedAddressQuery({
      isError: false,
      isLoading: false,
      data: validResidenceVerificationResponse,
    })
    renderAddressVerification()
    expect(screen.getByText('Address confirmation')).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.legend.residence')
    ).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.legend.mailing')
    ).toBeInTheDocument()
    //confirm address2 renders
    expect(screen.getByText('Unit 2B')).toBeInTheDocument()
  })

  it('clicking on the AS_VERIFIED option for mailing changes only the mailing address', async () => {
    //note different residential and mailing addresses
    mockClaimantInput(RESIDENTIAL_ADDRESS, false, MAILING_ADDRESS)
    mockVerifiedAddressQuery({
      isError: false,
      isLoading: false,
      data: validMailingVerificationResponse,
    })
    renderAddressVerification()
    userEvent.click(
      screen.getByTestId(
        'LOCAL_mailing_address_verification_selection.AS_VERIFIED'
      )
    )
    userEvent.click(
      screen.getByTestId(
        'LOCAL_residence_address_verification_selection.AS_ENTERED'
      )
    )
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith(
      expect.objectContaining({
        residence_address: RESIDENTIAL_ADDRESS,
        mailing_address: MAILING_ADDRESS,
      })
    )
  })

  //spinner
  it('renders spinner when loading', async () => {
    mockClaimantInput(RESIDENTIAL_ADDRESS, true, RESIDENTIAL_ADDRESS)
    mockVerifiedAddressQuery({
      isError: false,
      isLoading: true,
      data: validResidenceVerificationResponse,
    })
    renderAddressVerification()
    expect(
      await screen.findByTestId('address-verification-spinner')
    ).toBeInTheDocument()
  })

  it('renders error page for same mailing and residence addresses properly without response from the accumail service', () => {
    mockClaimantInput(RESIDENTIAL_ADDRESS, true, RESIDENTIAL_ADDRESS)
    mockVerifiedAddressQuery({
      isError: true,
      isLoading: false,
      data: { validationSummary: '' },
    })
    renderAddressVerification()
    expect(screen.getByText('Address confirmation')).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.no_match_singular')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('address_verification.proceed_singular')
    ).toBeInTheDocument()
  })

  it('renders error page for same mailing and residence addresses properly when NO_ADDRESS_MATCH response is returned', () => {
    mockClaimantInput(RESIDENTIAL_ADDRESS, true, RESIDENTIAL_ADDRESS)
    mockVerifiedAddressQuery({
      isError: false,
      isLoading: false,
      data: { validationSummary: NO_ADDRESS_MATCH },
    })
    renderAddressVerification()
    expect(screen.getByText('Address confirmation')).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.no_match_singular')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('address_verification.proceed_singular')
    ).toBeInTheDocument()
  })

  it('renders error page for different mailing and residence addresses properly when NO_ADDRESS_MATCH response is returned', () => {
    mockClaimantInput(RESIDENTIAL_ADDRESS, false, MAILING_ADDRESS)
    mockVerifiedAddressQuery({
      isError: false,
      isLoading: false,
      data: { validationSummary: NO_ADDRESS_MATCH },
    })
    renderAddressVerification()
    expect(screen.getByText('Address confirmation')).toBeInTheDocument()
    expect(
      screen.getByText('address_verification.no_match_plural')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('address_verification.proceed_plural')
    ).toBeInTheDocument()
    //confirm address2 renders
    expect(screen.getByText('Unit 2B')).toBeInTheDocument()
  })
})
