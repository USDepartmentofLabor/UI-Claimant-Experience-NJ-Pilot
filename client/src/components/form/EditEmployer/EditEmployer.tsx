import { useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'
import { array, boolean, mixed, object, string } from 'yup'
import { useEffect } from 'react'
import { i18n_claimForm } from 'i18n/i18n'
import { YourEmployer } from 'components/form/employer/YourEmployer/YourEmployer'
import { BusinessInterests } from 'components/form/employer/BusinessInterests/BusinessInterests'
import { WorkLocation } from '../employer/WorkLocation/WorkLocation'
import {
  ADDRESS_WITHOUT_STREET_SKELETON,
  PHONE_SKELETON,
} from 'constants/initialValues'
import { yupAddressWithoutStreet, yupPhone } from 'validations/yup/custom'
import { employerRelationOptions } from 'constants/formOptions'

type EditEmployerType = {
  index: string
}

export const EditEmployer = ({ index }: EditEmployerType) => {
  const { values } = useFormikContext<ClaimantInput>()
  useEffect(() => {
    /* Give employer initial values if they have not been initiated yet */
    if (
      values.employers &&
      values.employers[parseInt(index)] &&
      !values.employers[parseInt(index)].isInitiated
    ) {
      values.employers[parseInt(index)] = {
        ...editEmployerInitialValues(),
        ...values.employers[parseInt(index)],
      }
    }
  })
  return (
    <>
      {
        /* Add our components here */
        /* Satisfy error checking, will remove when we no longer directly reference the array */
        values.employers && values.employers[parseInt(index)] ? (
          /* Add employer form values here */
          <div>
            <div data-testid="edit-employer-test-subheader">
              This is the employer name {values.employers[parseInt(index)].name}
            </div>
            <YourEmployer index={index} />
            <WorkLocation index={index} />
            <BusinessInterests index={index} />
          </div>
        ) : (
          /* Invalid Index */ <div>No employer defined for index {index}</div>
        )
      }
    </>
  )
}

/* THIS IS WHERE YOU DEFINE THE INITIAL VALUES */
export const editEmployerInitialValues = () => {
  return {
    name: '',
    isInitiated: true,
    // Your Employer
    is_full_time: undefined,
    // Work Location
    worked_at_employer_address: undefined,
    alternate_physical_work_address: { ...ADDRESS_WITHOUT_STREET_SKELETON },
    is_employer_phone_accurate: undefined,
    work_location_phone: { ...PHONE_SKELETON },
    // Business Interests
    self_employed: undefined,
    is_owner: undefined,
    corporate_officer_or_stock_ownership: undefined,
    employer_is_sole_proprietorship: undefined,
    related_to_owner_or_child_of_owner_under_18: undefined,
  }
}

const yupEditEmployer = object().shape({
  /* THIS IS WHERE WE DEFINE THE SCHEMA FOR THE EDIT EMPLOYER PAGE */
  name: string().required(i18n_claimForm.t('employers.name.required')),
  // Your Employer
  is_full_time: boolean().required(
    i18n_claimForm.t('your_employer.is_full_time.required')
  ),
  // Work Location
  worked_at_employer_address: boolean().required(
    i18n_claimForm.t(
      'employers.work_location.worked_at_employer_address.required'
    )
  ),
  alternate_physical_work_address: mixed().when('worked_at_employer_address', {
    is: false,
    then: yupAddressWithoutStreet(),
  }),
  is_employer_phone_accurate: boolean().required(
    i18n_claimForm.t(
      'employers.work_location.is_employer_phone_accurate.required'
    )
  ),
  work_location_phone: mixed().when('is_employer_phone_accurate', {
    is: false,
    then: yupPhone,
  }),
  // Business Interests
  self_employed: boolean().required(
    i18n_claimForm.t(
      'employers.business_interests.self_employed.errors.required'
    )
  ),
  is_owner: boolean().required(
    i18n_claimForm.t('employers.business_interests.is_owner.errors.required')
  ),
  corporate_officer_or_stock_ownership: boolean().required(
    i18n_claimForm.t('employers.business_interests.is_owner.errors.required')
  ),
  employer_is_sole_proprietorship: boolean().when(
    'corporate_officer_or_stock_ownership',
    {
      is: false,
      then: boolean().required(
        i18n_claimForm.t(
          'employers.business_interests.employer_is_sole_proprietorship.errors.required'
        )
      ),
    }
  ),
  related_to_owner_or_child_of_owner_under_18: string().when(
    'employer_is_sole_proprietorship',
    {
      is: false,
      then: (schema) =>
        schema
          .oneOf([...employerRelationOptions])
          .required(
            i18n_claimForm.t(
              'employers.business_interests.related_to_owner_or_child_of_owner_under_18.errors.required'
            )
          ),
    }
  ),
})

export const yupEditEmployers = object().shape({
  employers: array().of(yupEditEmployer),
})
