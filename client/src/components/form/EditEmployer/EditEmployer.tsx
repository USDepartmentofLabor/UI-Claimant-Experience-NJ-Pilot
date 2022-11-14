import { useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'
import { TFunction } from 'react-i18next'
import * as yup from 'yup'
import { array, string } from 'yup'
import { useEffect } from 'react'
import { YourEmployer } from '../../Employer/YourEmployer/YourEmployer'
import { i18n_claimForm } from '../../../i18n/i18n'

import { yupDate } from 'validations/yup/custom'
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
    is_full_time: undefined,
    expect_to_be_recalled: undefined,
    employment_start_date: undefined,
    employment_last_date: undefined,
  }
}

const yupEditEmployer = (t: TFunction<'claimForm'>) => {
  return yup.object().shape({
    /* THIS IS WHERE WE DEFINE THE SCHEMA FOR THE EDIT EMPLOYER PAGE */
    name: string().required(t('employers.name.required')),
    is_full_time: yup
      .boolean()
      .required(i18n_claimForm.t('your_employer.is_full_time.required')),
    expect_to_be_recalled: yup
      .boolean()
      .required(
        i18n_claimForm.t(
          'employers.separation.expect_to_be_recalled.errors.required'
        )
      ),
    employment_start_date: yupDate(
      String('employers.separation.employment_start_date.required')
    ),
    employment_last_date: yupDate(
      String('employers.separation.employment_last_date.required')
    ),
  })
}

export const yupEditEmployers = (t: TFunction<'claimForm'>) => {
  return yup.object().shape({
    employers: array().of(yupEditEmployer(t)),
  })
}
