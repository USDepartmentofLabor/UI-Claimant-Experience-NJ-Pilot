import { AddressVerificationInput } from 'types/claimantInput'
import { NextPageWithLayout } from 'pages/_app'
import { ReactNode } from 'react'
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
import Spinner from '../../components/Spinner/Spinner'

const pageDefinition = AddressVerificationPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)
export const pageInitialValues: AddressVerificationInput = {
  residence_address: { ...ADDRESS_SKELETON },
  LOCAL_mailing_address_same: false,
  mailing_address: { ...ADDRESS_SKELETON },
}

function AddressSelector() {
  const { t } = useTranslation('claimForm')
  const { values, setFieldValue } = useFormikContext<AddressVerificationInput>()
  //kept as an explicit constant as the handleAddressChange updates formik and overwrites the value
  const ENTERED_RESIDENTIAL_ADDRESS = values.residence_address
  const ENTERED_MAILING_ADDRESS = values.mailing_address

  const handleResidenceAddressChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = evt.target
    const optionToSave = residenceAddressOptions?.find((o) => o.value === value)
    if (optionToSave) {
      await setFieldValue('residence_address', optionToSave.address)
      // keep mailing address the same as the residence
      if (!values.LOCAL_mailing_address_same) {
        await setFieldValue('mailing_address', optionToSave.address)
      }
    } // otherwise make no changes to preserve input from previous screen despite error here
  }

  const handleMailingAddressChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = evt.target
    await setFieldValue('mailing_address', value)
  }

  const verifiedResidenceAddressData = useVerifiedAddress(
    values.residence_address
  )
  const residenceAddressOptions = [
    {
      value: 'AS_ENTERED',
      label: t('address_verification.entered'),
      address: ENTERED_RESIDENTIAL_ADDRESS,
    },
    {
      value: 'AS_VERIFIED',
      label: t('address_verification.verified'),
      address: verifiedResidenceAddressData?.data?.data?.address,
    },
  ] as const

  const verifiedMailingAddressData = useVerifiedAddress(values.mailing_address)
  const mailingAddressOptions = [
    {
      value: 'AS_ENTERED',
      label: t('address_verification.entered'),
      address: ENTERED_MAILING_ADDRESS,
    },
    {
      value: 'AS_VERIFIED',
      label: t('address_verification.verified'),
      address: verifiedMailingAddressData?.data?.data?.address,
    },
  ] as const
  return (
    <>
      <RadioField
        tile
        name="residence_address"
        legend={t('address_verification.legend.residence')}
        onChange={handleResidenceAddressChange}
        options={residenceAddressOptions.map((residenceAddressOption) => {
          return {
            value: residenceAddressOption.value,
            label: residenceAddressOption.label,
            labelDescription: (
              <>
                {verifiedResidenceAddressData.isLoading &&
                  residenceAddressOption.value === 'AS_VERIFIED' && (
                    <Spinner
                      data-testid="address-verification-spinner"
                      className="margin-top-2, padding-left-05"
                    />
                  )}
                {residenceAddressOption.address && (
                  <div>
                    <div>{residenceAddressOption.address.address}</div>
                    <div>
                      {residenceAddressOption.address.city},{' '}
                      {residenceAddressOption.address.state}{' '}
                      {residenceAddressOption.address.zipcode}
                    </div>
                  </div>
                )}
              </>
            ),
          }
        })}
      />
      {!values.LOCAL_mailing_address_same && (
        <RadioField
          name="mailing_address"
          legend={t('address_verification.legend.mailing')}
          onChange={handleMailingAddressChange}
          options={mailingAddressOptions.map((mailingAddressOption) => {
            return {
              value: mailingAddressOption.value,
              label: mailingAddressOption.label,
              labelDescription: (
                <>
                  <div>
                    <div>{mailingAddressOption.address?.address}</div>
                    <div>
                      {mailingAddressOption.address?.city},{' '}
                      {mailingAddressOption.address?.state}{' '}
                      {mailingAddressOption.address?.zipcode}
                    </div>
                  </div>
                </>
              ),
            }
          })}
        />
      )}
      <ClaimFormButtons nextStep={nextPage.heading}>
        <BackButton previousPage={previousPage.path} />
        <NextButton nextPage={nextPage.path} />
      </ClaimFormButtons>
    </>
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
      <AddressSelector />
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
