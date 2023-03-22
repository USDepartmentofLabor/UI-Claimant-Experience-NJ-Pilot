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
import { AddressVerificationField } from 'components/form/fields/AddressVerificationField/AddressVerificationField'

const pageDefinition = AddressVerificationPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

export const pageInitialValues = {
  residence_address: { ...ADDRESS_SKELETON },
  LOCAL_mailing_address_same: false,
  mailing_address: { ...ADDRESS_SKELETON },
}

const MAILING_ADDRESS_OPTIONS = [
  {
    label: 'You entered:',
    address: {
      address: '123 Test St',
      city: 'Hoboken',
      state: 'NJ',
      zipcode: '01833',
    },
    value: 'as-entered',
  },
  {
    label: 'U.S. Postal Service recommends:',
    address: {
      address: '1234 Test St',
      city: 'Hoboken',
      state: 'NJ',
      zipcode: '01833',
    },
    value: 'as-verified',
  },
]

const AddressVerification: NextPageWithLayout = () => {
  // const { t } = useTranslation('claimForm')
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
            <AddressVerificationField
              name="mailing_address"
              options={MAILING_ADDRESS_OPTIONS}
              legend={`Which address do you want to use for your mailing address?`}
            />
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
