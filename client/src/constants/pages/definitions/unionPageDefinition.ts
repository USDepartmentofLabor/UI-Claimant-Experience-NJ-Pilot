import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { boolean, object, string } from 'yup'

const validationSchema = object().shape({
  required_to_seek_work_through_hiring_hall: boolean()
    .nullable()
    .required(
      i18n_claimForm.t(
        'union.required_to_seek_work_through_hiring_hall.errors.required'
      )
    ),
  union_name: string().when('required_to_seek_work_through_hiring_hall', {
    is: true,
    then: (schema) =>
      schema
        .max(32, i18n_claimForm.t('union.union_name.errors.maxLength'))
        .required(i18n_claimForm.t('union.union_name.errors.required')),
  }),
  union_local_number: string().when(
    'required_to_seek_work_through_hiring_hall',
    {
      is: true,
      then: (schema) =>
        schema
          .matches(
            /^\d+$/,
            i18n_claimForm.t('union.union_local_number.errors.digitsOnly')
          )
          .max(
            16,
            i18n_claimForm.t('union.union_local_number.errors.maxLength')
          )
          .required(
            i18n_claimForm.t('union.union_local_number.errors.required')
          ),
    }
  ),
})

export const UnionPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('union.heading'),
  path: Routes.CLAIM.UNION,
  validationSchema,
}
