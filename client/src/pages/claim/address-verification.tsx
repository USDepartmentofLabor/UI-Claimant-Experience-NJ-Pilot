import { AddressVerificationInput } from 'types/claimantInput'
import { NextPageWithLayout } from 'pages/_app'
import { ReactNode, useState } from 'react'
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
import { useTranslation } from 'next-i18next'
import { RadioField } from '../../components/form/fields/RadioField/RadioField'
import { useFormikContext } from 'formik'
import { useVerifiedAddress } from '../../queries/useVerifiedAddress'
import Spinner from 'components/Spinner/Spinner'

const pageDefinition = AddressVerificationPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)
const AS_ENTERED = 'AS_ENTERED'
const AS_VERIFIED = 'AS_VERIFIED'
export const pageInitialValues: AddressVerificationInput = {
  residence_address: { ...ADDRESS_SKELETON },
  LOCAL_mailing_address_same: false,
  mailing_address: { ...ADDRESS_SKELETON },
  LOCAL_residence_address_verification_selection: AS_ENTERED,
  LOCAL_mailing_address_verification_selection: AS_ENTERED,
}

interface AddressSelectorInputProps {
  handleChangeAddress: any
  name: string
  legend: string
  options: any
}

function AddressVerificationFeedback() {
  const { t } = useTranslation('claimForm')
  const { values, setFieldValue } = useFormikContext<AddressVerificationInput>()
  //kept as an explicit constant as the handleAddressChange updates formik and overwrites the value
  const [ENTERED_RESIDENTIAL_ADDRESS] = useState(values.residence_address)
  const [ENTERED_MAILING_ADDRESS] = useState(values.mailing_address)

  const handleResidenceAddressChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = evt.target
    const optionToSave = residenceAddressOptions.find((o) => o.value === value)
    if (optionToSave) {
      await setFieldValue('residence_address', optionToSave.address)
      // keep mailing address the same as the residence
      if (values.LOCAL_mailing_address_same) {
        await setFieldValue('mailing_address', optionToSave.address)
      }
    } // otherwise make no changes to preserve input from previous screen despite error here
  }

  const handleMailingAddressChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = evt.target
    const optionToSave = mailingAddressOptions.find((o) => o.value === value)
    if (optionToSave) {
      await setFieldValue('mailing_address', optionToSave.address)
    } // otherwise make no changes to preserve input from previous screen despite error here
  }

  const {
    isLoading: isVerifiedResidenceAddressLoading,
    data: verifiedResidenceAddressData,
  } = useVerifiedAddress(
    ENTERED_RESIDENTIAL_ADDRESS,
    { enabled: true }
    //query should always execute in order to check the user input
  )
  const {
    isLoading: isVerifiedMailingAddressLoading,
    data: verifiedMailingAddressData,
  } = useVerifiedAddress(
    ENTERED_MAILING_ADDRESS,
    { enabled: !values.LOCAL_mailing_address_same }
    //query only executes if the mailing and residence are different
  )

  const residenceAddressOptions = [
    {
      value: AS_ENTERED,
      label: t('address_verification.entered'),
      address: ENTERED_RESIDENTIAL_ADDRESS,
    },
    {
      value: AS_VERIFIED,
      label: t('address_verification.verified'),
      address: verifiedResidenceAddressData?.address,
    },
  ] as const
  const mailingAddressOptions = [
    {
      value: AS_ENTERED,
      label: t('address_verification.entered'),
      address: ENTERED_MAILING_ADDRESS,
    },
    {
      value: AS_VERIFIED,
      label: t('address_verification.verified'),
      address: verifiedMailingAddressData?.address,
    },
  ] as const

  if (isVerifiedResidenceAddressLoading || isVerifiedMailingAddressLoading) {
    return <Spinner data-testid={'address-verification-spinner'} />
  }
  return (
    <>
      <AddressSelector
        handleChangeAddress={handleResidenceAddressChange}
        name={'LOCAL_residence_address_verification_selection'}
        legend={t('address_verification.legend.residence')}
        options={residenceAddressOptions}
      />
      {!values.LOCAL_mailing_address_same && (
        <AddressSelector
          handleChangeAddress={handleMailingAddressChange}
          name={'LOCAL_mailing_address_verification_selection'}
          legend={t('address_verification.legend.mailing')}
          options={mailingAddressOptions}
        />
      )}
      <ClaimFormButtons nextStep={nextPage.heading}>
        <BackButton previousPage={previousPage.path} />
        <NextButton nextPage={nextPage.path} />
      </ClaimFormButtons>
    </>
  )
}

const AddressSelector = ({
  handleChangeAddress,
  name,
  legend,
  options,
}: AddressSelectorInputProps) => {
  return (
    <RadioField
      tile
      name={name}
      legend={legend}
      onChange={handleChangeAddress}
      options={options.map((option) => {
        return {
          value: option.value,
          label: option.label,
          labelDescription: (
            <>
              <div>
                <div>{option.address?.address}</div>
                <div>
                  {option.address?.city}, {option.address?.state}{' '}
                  {option.address?.zipcode}
                </div>
              </div>
            </>
          ),
        }
      })}
    />
  )
}

const AddressVerification: NextPageWithLayout = () => {
  return (
    <ClaimFormik<AddressVerificationInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      <AddressVerificationFeedback />
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
