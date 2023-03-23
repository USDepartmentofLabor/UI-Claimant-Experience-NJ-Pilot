import { AddressInput, AddressVerificationInput } from 'types/claimantInput'
import { NextPageWithLayout } from 'pages/_app'
import { ReactNode, useContext } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { AddressVerificationPageDefinition } from 'constants/pages/definitions/addressVerificationPageDefinition'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { ADDRESS_SKELETON } from 'constants/initialValues'
import { AddressVerificationField } from 'components/form/fields/AddressVerificationField/AddressVerificationField'
import { useGetVerifiedAddress } from '../../queries/useGetVerifiedAddress'
import { ClaimFormContext } from '../../contexts/ClaimFormContext'

const pageDefinition = AddressVerificationPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

export const pageInitialValues = {
  residence_address: { ...ADDRESS_SKELETON },
  LOCAL_mailing_address_same: false,
  mailing_address: { ...ADDRESS_SKELETON },
}

const AddressVerification: NextPageWithLayout = () => {
  // const { t } = useTranslation('claimForm')
  const input = useContext(ClaimFormContext)
  const {
    data: verifiedMailingAddress,
    isLoading: isLoadingVerifiedMailingAddress,
    isError: isVerifiedMailingAddressError,
    error: verifiedMailingAddressError,
  } = useGetVerifiedAddress(input?.claimFormValues?.mailing_address)
  const {
    data: verifiedResidentialAddress,
    isLoading: isLoadingVerifiedResidentialAddress,
    isError: isVerifiedResidentialAddressError,
    error: verifiedResidentialAddressError,
  } = useGetVerifiedAddress(input?.claimFormValues?.residence_address)
  const resolvedVerifiedMailingAddress = (): AddressInput => {
    return (
      !isLoadingVerifiedMailingAddress && verifiedMailingAddress?.data.address
    )
  }
  const resolvedVerifiedResidentialAddress = (): AddressInput => {
    return (
      !isLoadingVerifiedResidentialAddress &&
      verifiedResidentialAddress?.data.address
    )
  }
  const MAILING_ADDRESS_OPTIONS = [
    {
      label: 'You entered:',
      address: input?.claimFormValues?.mailing_address || ADDRESS_SKELETON,
      value: 'as-entered',
    },
    {
      label: 'U.S. Postal Service recommends:',
      address: resolvedVerifiedMailingAddress(), // TODO MRH: Why is this the same as the residential address call?
      value: 'as-verified',
    },
  ]

  const RESIDENCE_ADDRESS_OPTIONS = [
    {
      label: 'You entered:',
      address: input?.claimFormValues?.residence_address || ADDRESS_SKELETON,
      value: 'as-entered',
    },
    {
      label: 'U.S. Postal Service recommends:',
      address: resolvedVerifiedResidentialAddress(),
      value: 'as-verified',
    },
  ]

  return (
    <ClaimFormik<AddressVerificationInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values }) => {
        return (
          <>
            {/*TODO MRH handle Loading state*/}
            <AddressVerificationField
              name="residence_address"
              options={RESIDENCE_ADDRESS_OPTIONS}
              legend={`Which address do you want to use as your residence?`}
            />
            {!values.LOCAL_mailing_address_same && (
              <AddressVerificationField
                className="margin-top-2"
                name="mailing_address"
                options={MAILING_ADDRESS_OPTIONS}
                legend={`Which address do you want to use for your mailing address?`}
              />
            )}
            <ClaimFormButtons nextStep={nextPage.heading}>
              <BackButton previousPage={previousPage.path} />
              <NextButton nextPage={nextPage.path} />
            </ClaimFormButtons>
          </>
        )
      }}
    </ClaimFormik>
  )
}

AddressVerification.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default AddressVerification
