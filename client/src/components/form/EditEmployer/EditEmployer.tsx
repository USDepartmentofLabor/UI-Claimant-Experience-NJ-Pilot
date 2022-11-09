import { useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'
import { TFunction } from 'react-i18next'
import * as yup from 'yup'
import { array, string } from 'yup'
import { useEffect } from 'react'

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
            This is the employer name {values.employers[parseInt(index)].name}
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
  }
}

const yupEditEmployer = (t: TFunction<'claimForm'>) => {
  return yup.object().shape({
    name: string().required(t('employers.name.required')),
    /* THIS IS WHERE WE DEFINE THE SCHEMA FOR THE EDIT EMPLOYER PAGE */
  })
}

export const yupEditEmployers = (t: TFunction<'claimForm'>) => {
  return yup.object().shape({
    employers: array().of(yupEditEmployer(t)),
  })
}
