import { NextPage } from 'next'

import { useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import TextField from 'components/form/fields/TextField/TextField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { useClearFields } from 'hooks/useClearFields'
import { ClaimantInput } from 'types/claimantInput'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { boolean, object, string } from 'yup'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { ChangeEventHandler } from 'react'

export const Union: NextPage = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'union' })
  const { values } = useFormikContext<ClaimantInput>()
  const { clearFields } = useClearFields()

  const handleSeekWorkThroughHiringHallChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    // Remove conditional data if previous answer is changed
    if (e.target.value === 'no') {
      clearFields(['union_name', 'union_local_number'])
    }
  }

  return (
    <>
      <YesNoQuestion
        question={t('required_to_seek_work_through_hiring_hall.label')}
        name="required_to_seek_work_through_hiring_hall"
        onChange={handleSeekWorkThroughHiringHallChange}
      />
      {values.required_to_seek_work_through_hiring_hall === true && (
        <>
          <TextField
            label={t('union_name.label')}
            type="text"
            name="union_name"
          />
          <TextField
            label={t('union_local_number.label')}
            type="text"
            name="union_local_number"
          />
        </>
      )}
    </>
  )
}

export const UnionPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('union.heading'),
  path: Routes.CLAIM.UNION,
  initialValues: {
    required_to_seek_work_through_hiring_hall: undefined,
  },
  validationSchema: object().shape({
    required_to_seek_work_through_hiring_hall: boolean().required(
      i18n_claimForm.t(
        'union.required_to_seek_work_through_hiring_hall.errors.required'
      )
    ),
    union_name: string().when('required_to_seek_work_through_hiring_hall', {
      is: true,
      then: (schema) =>
        schema
          .max(32)
          .required(i18n_claimForm.t('union.union_name.errors.required')),
    }),
    union_local_number: string().when(
      'required_to_seek_work_through_hiring_hall',
      {
        is: true,
        then: (schema) =>
          schema
            .max(16)
            .required(
              i18n_claimForm.t('union.union_local_number.errors.required')
            ),
      }
    ),
  }),
}

export default Union
