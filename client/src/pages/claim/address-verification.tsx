import { AddressInput } from 'types/claimantInput'
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
import { Trans, useTranslation } from 'next-i18next'
import { RadioField } from '../../components/form/fields/RadioField/RadioField'
import { useFormikContext } from 'formik'
import { useVerifiedAddress } from '../../queries/useVerifiedAddress'
import Spinner from 'components/Spinner/Spinner'
import { CORRECTED_ADDRESS } from '../../constants/api/services/verifyAddress'
import { Alert, Card, CardGroup } from '@trussworks/react-uswds'

const pageDefinition = AddressVerificationPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)
const AS_ENTERED = 'AS_ENTERED'
const AS_VERIFIED = 'AS_VERIFIED'

export type AddressVerificationInput = {
  residence_address: AddressInput
  mailing_address: AddressInput
  LOCAL_mailing_address_same: boolean // NOT CheckboxInput, because it starts false (is never null)
  LOCAL_residence_address_verification_selection: string
  LOCAL_mailing_address_verification_selection: string
}
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

  //not checking for error on either response as the default case is to use the entered address
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
  //only allow selecting an address if the residence and mailing are the same or both addresses have proposed corrections
  // this directs the claimant to the default case below where one, the other, or both addresses need revision
  if (
    (verifiedResidenceAddressData?.validationSummary === CORRECTED_ADDRESS &&
      values.LOCAL_mailing_address_same) ||
    (verifiedResidenceAddressData?.validationSummary === CORRECTED_ADDRESS &&
      verifiedMailingAddressData?.validationSummary === CORRECTED_ADDRESS)
  ) {
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
      </>
    )
  }
  //default state, covers if there is an error in either verification response, or if there were no matches from the verification check
  return (
    <>
      <Alert type={'warning'} headingLevel="h2" role="alert" slim>
        {values.LOCAL_mailing_address_same &&
          t('address_verification.same_address.no_match')}
        {!values.LOCAL_mailing_address_same &&
          t('address_verification.distinct_addresses.no_match')}
      </Alert>
      <p>
        {values.LOCAL_mailing_address_same &&
          t('address_verification.same_address.entered')}
        {!values.LOCAL_mailing_address_same &&
          t('address_verification.distinct_addresses.entered')}
      </p>
      <CardGroup
        className="flex-column margin-top-105 margin-bottom-1"
        data-testid="entered_addresses_card_group"
      >
        <Card className="margin-bottom-105">
          {formattedAddress(ENTERED_RESIDENTIAL_ADDRESS, true)}
        </Card>
        {!values.LOCAL_mailing_address_same && (
          <Card className="margin-bottom-0">
            {formattedAddress(ENTERED_MAILING_ADDRESS, true)}
          </Card>
        )}
      </CardGroup>
      <p>
        {values.LOCAL_mailing_address_same && (
          <Trans t={t} i18nKey={'address_verification.same_address.proceed'}>
            <u>{''}</u>
          </Trans>
        )}
        {!values.LOCAL_mailing_address_same && (
          <Trans
            t={t}
            i18nKey={'address_verification.distinct_addresses.proceed'}
          >
            <u>{''}</u>
          </Trans>
        )}
      </p>
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
      options={options.map((option: any) => {
        return {
          value: option.value,
          label: option.label,
          labelDescription: formattedAddress(option.address),
        }
      })}
    />
  )
}

const formattedAddress = (address: AddressInput, isCardContent?: boolean) => {
  return (
    <div
      className={`${
        isCardContent ? 'padding-bottom-105 padding-top-105 padding-left-3' : ''
      }`}
    >
      <div>{address.address}</div>
      {address.address2 && <div>{address.address2}</div>}
      <div>
        {address.city}, {address.state} {address.zipcode}
      </div>
    </div>
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
      <ClaimFormButtons nextStep={nextPage.heading}>
        <BackButton previousPage={previousPage.path} />
        <NextButton nextPage={nextPage.path} />
      </ClaimFormButtons>
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
