import { useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'
import { array, boolean, object, string } from 'yup'
import { yupDate } from 'validations/yup/custom'
import { useEffect } from 'react'
import { i18n_claimForm } from 'i18n/i18n'
import { YourEmployer } from 'components/form/employer/YourEmployer/YourEmployer'
import {
  changeInEmploymentOptions,
  employerRelationOptions,
} from 'constants/formOptions'
import { BusinessInterests } from 'components/form/employer/BusinessInterests/BusinessInterests'
import { ChangeInEmployment } from 'components/Employer/ChangeInEmployment/ChangeInEmployment'

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
            <BusinessInterests index={index} />
            <ChangeInEmployment index={index} />
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
    // Business Interests
    self_employed: undefined,
    is_owner: undefined,
    corporate_officer_or_stock_ownership: undefined,
    employer_is_sole_proprietorship: undefined,
    related_to_owner_or_child_of_owner_under_18: undefined,
    // Change in Employment
    expect_to_be_recalled: undefined,
    employment_start_date: undefined,
    employment_last_date: undefined,
  }
}
const yupEditEmployer = object().shape({
  /* THIS IS WHERE WE DEFINE THE SCHEMA FOR THE EDIT EMPLOYER PAGE */
  name: string().required(i18n_claimForm.t('employers.name.required')),
  // Your Employer
  is_full_time: boolean().required(
    i18n_claimForm.t('your_employer.is_full_time.required')
  ),
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
  separation_circumstance: string()
    .oneOf([...changeInEmploymentOptions])
    .required(i18n_claimForm.t('employers.separation.reason.required')),
  expect_to_be_recalled: boolean().required(
    i18n_claimForm.t(
      'employers.separation.expect_to_be_recalled.errors.required'
    )
  ),
  employment_start_date: yupDate(
    String('employers.separation.employment_start_date.required')
  ).required(
    i18n_claimForm.t('employers.separation.employment_start_date.required')
  ),
  employment_last_date: yupDate(
    String('employers.separation.employment_last_date.required')
  ).required(
    i18n_claimForm.t('employers.separation.employment_last_date.required')
  ),
})

export const yupEditEmployers = object().shape({
  employers: array().of(yupEditEmployer),
})
