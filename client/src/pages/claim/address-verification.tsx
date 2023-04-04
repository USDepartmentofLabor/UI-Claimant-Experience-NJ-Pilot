import { AddressInput, AddressVerificationInput } from 'types/claimantInput'
import { NextPageWithLayout } from 'pages/_app'
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
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
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { useTranslation } from 'next-i18next'

const pageDefinition = AddressVerificationPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

export const pageInitialValues = {
  residence_address: { ...ADDRESS_SKELETON },
  LOCAL_mailing_address_same: false,
  mailing_address: { ...ADDRESS_SKELETON },
}

const AddressVerification: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')
  const { claimFormValues, setClaimFormValues } = useContext(ClaimFormContext)
  const [enteredMailingAddress, setEnteredMailingAddress] =
    useState<AddressInput | null>(null)
  const [enteredResidenceAddress, setEnteredResidenceAddress] =
    useState<AddressInput | null>(null)
  const isMailingSame = claimFormValues?.LOCAL_mailing_address_same

  useEffect(() => {
    if (!enteredMailingAddress && claimFormValues?.mailing_address) {
      setEnteredMailingAddress({ ...claimFormValues.mailing_address })
    }
    if (!enteredResidenceAddress && claimFormValues?.residence_address) {
      setEnteredResidenceAddress({ ...claimFormValues.residence_address })
    }
  }, [
    enteredMailingAddress,
    enteredResidenceAddress,
    claimFormValues?.mailing_address,
    claimFormValues?.residence_address,
  ])

  const handleResidenceAddressChange = useCallback(
    (address: AddressInput) => {
      setClaimFormValues({
        ...claimFormValues,
        residence_address: address,
      })
    },
    [setClaimFormValues]
  )

  const handleMailingAddressChange = useCallback(
    (address: AddressInput) => {
      setClaimFormValues({
        ...claimFormValues,
        mailing_address: address,
      })
    },
    [setClaimFormValues]
  )

  return (
    <ClaimFormik<AddressVerificationInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {() => {
        return (
          <>
            {enteredResidenceAddress && (
              <AddressVerificationField
                name="mailing_address"
                address={enteredResidenceAddress}
                legend={t(`address_verification.legend.residence`)}
                changeAddress={handleResidenceAddressChange}
              />
            )}
            {!isMailingSame && enteredMailingAddress && (
              <AddressVerificationField
                name="residence_address"
                address={enteredMailingAddress}
                legend={t(`address_verification.legend.mailing`)}
                changeAddress={handleMailingAddressChange}
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
