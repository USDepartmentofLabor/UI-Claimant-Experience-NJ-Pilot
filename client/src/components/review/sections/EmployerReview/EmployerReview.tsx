import { useContext } from 'react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
// import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { useTranslation } from 'next-i18next'
// import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
import {
  ImportedEmployerAddress,
  AddressWithoutStreetInput,
  Employer,
} from 'types/claimantInput'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import { EditEmployerPageDefinition } from 'constants/pages/definitions/editEmployerPageDefinition'
import { formatStoredToDisplayPhone } from 'utils/phone/format'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
export const buildAlternateEmployerAddress = (
  alternateEmployerAddress: AddressWithoutStreetInput | undefined
) => {
  const { city, state, zipcode } = alternateEmployerAddress || {}

  if (state === undefined && city === undefined && zipcode === undefined) {
    return undefined
  }

  return `{city}${city && ', '}${state}${state && ' '}${zipcode}`
}
const addAddress = (
  currentAddr: string,
  newAddition: string | undefined | null
) => {
  if (newAddition === undefined || newAddition === null) {
    return currentAddr
  }
  if (currentAddr !== '') {
    currentAddr = currentAddr.concat('\n')
  }
  currentAddr = currentAddr.concat(newAddition)

  return currentAddr
}
export const buildImportedEmployerAddress = (
  importedAddress: ImportedEmployerAddress | undefined
) => {
  const {
    employerAddressLine1,
    employerAddressLine2,
    employerAddressLine3,
    employerAddressLine4,
    employerAddressLine5,
    employerAddressZip,
  } = importedAddress || {}

  if (
    employerAddressLine1 === undefined &&
    employerAddressLine2 === undefined &&
    employerAddressLine3 === undefined &&
    employerAddressLine4 === undefined &&
    employerAddressLine5 === undefined &&
    employerAddressZip === undefined
  ) {
    return undefined
  }
  const addresses = [
    employerAddressLine1,
    employerAddressLine2,
    employerAddressLine3,
    employerAddressLine4,
    employerAddressLine5,
    employerAddressZip,
  ]

  let addr = ''
  for (const addressField of addresses) {
    addr = addAddress(addr, addressField)
  }
  return addr
}
export const EmployerReview = ({
  employer,
  index,
}: {
  employer: Employer
  index: number
}) => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  let { path } = EditEmployerPageDefinition
  path = path + '/' + String(index)
  if (!employer.worked_for_imported_employer_in_last_18mo) {
    return null
  }
  console.log(
    'related to owner value is ',
    employer?.related_to_owner_or_child_of_owner_under_18
  )
  return (
    <ReviewSection heading={employer.employer_name} editUrl={path}>
      <ReviewElement
        label={t('verified_fields.employer_address')}
        value={buildImportedEmployerAddress(employer?.imported_address)}
      />
      <ReviewElement
        label={t('verified_fields.employer_phone')}
        value={formatStoredToDisplayPhone(employer?.employer_phone?.number)}
      />
      <ReviewElement label={t('verified_fields.fein')} value={employer?.fein} />
      <ReviewYesNo
        label={t('your_employer.is_full_time.label')}
        value={employer?.is_full_time}
      />
      <ReviewYesNo
        label={t('work_location.worked_at_employer_address.label')}
        value={employer?.worked_at_employer_address}
      />
      {employer?.worked_at_employer_address === false && (
        <ReviewElement
          label={t('work_location.section_title')}
          value={buildAlternateEmployerAddress(
            employer.alternate_physical_work_address
          )}
        />
      )}
      <ReviewYesNo
        label={t('work_location.is_employer_phone_accurate.label')}
        value={employer?.is_employer_phone_accurate}
      />
      {employer?.is_employer_phone_accurate === false && (
        <ReviewElement
          label={t('alt_employer_phone')}
          value={formatStoredToDisplayPhone(
            employer?.work_location_phone?.number
          )}
        />
      )}
      <ReviewYesNo
        label={t('business_interests.self_employed.label')}
        value={employer?.self_employed}
      />
      <ReviewYesNo
        label={t('business_interests.is_owner.label')}
        value={employer?.is_owner}
      />
      <ReviewYesNo
        label={t(
          'business_interests.corporate_officer_or_stock_ownership.label'
        )}
        value={employer?.corporate_officer_or_stock_ownership}
      />
      {employer?.corporate_officer_or_stock_ownership === false && (
        <ReviewYesNo
          label={t('business_interests.employer_is_sole_proprietorship.label')}
          value={employer?.employer_is_sole_proprietorship}
        />
      )}
      {/* {employer?.employer_is_sole_proprietorship===false && (
              <ReviewElement
              label={t('business_interests.related_to_owner_or_child_of_owner_under_18.label')}
              value={t(
                `business_interests.related_to_owner_or_child_of_owner_under_18.options.${employer?.related_to_owner_or_child_of_owner_under_18}.label`)
                }
            />
        ) } sole proprietorship question  */}
    </ReviewSection>
  )
}
export const EmployersReview = () => {
  //   const { t } = useTranslation('claimForm')

  const { claimFormValues } = useContext(ClaimFormContext)

  //   const { heading, path } = PersonalPageDefinition

  return (
    <>
      {claimFormValues?.employers &&
        claimFormValues?.employers.length > 0 &&
        claimFormValues?.employers.map((employer, idx) => (
          <EmployerReview
            employer={employer}
            index={idx}
            key={idx}
          ></EmployerReview>
        ))}
    </>
  )
}
