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

export const Union: NextPage = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'union' })
  const { values } = useFormikContext<ClaimantInput>()

  // Remove conditional data if previous answer is changed
  useClearFields(values.union?.is_union_member === false, [
    'union.union_name',
    'union.union_local_number',
    'union.required_to_seek_work_through_hiring_hall',
  ])

  return (
    <>
      <YesNoQuestion
        question={t('is_union_member.label')}
        name="union.is_union_member"
      />
      {values.union?.is_union_member === true && (
        <>
          <TextField
            label={t('union_name.label')}
            type="text"
            name="union.union_name"
          />
          <TextField
            label={t('union_local_number.label')}
            type="text"
            name="union.union_local_number"
          />
          <YesNoQuestion
            question={t('required_to_seek_work_through_hiring_hall.label')}
            name="union.required_to_seek_work_through_hiring_hall"
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
    union: { is_union_member: undefined },
  },
  validationSchema: object().shape({
    union: object().shape({
      is_union_member: boolean().required(
        i18n_claimForm.t('union.is_union_member.errors.required')
      ),
      union_name: string().when('is_union_member', {
        is: true,
        then: string()
          .max(32)
          .required(i18n_claimForm.t('union.union_name.errors.required')),
      }),
      union_local_number: string().when('is_union_member', {
        is: true,
        then: string()
          .max(16)
          .required(
            i18n_claimForm.t('union.union_local_number.errors.required')
          ),
      }),
      required_to_seek_work_through_hiring_hall: boolean().when(
        'is_union_member',
        {
          is: true,
          then: boolean().required(
            i18n_claimForm.t(
              'union.required_to_seek_work_through_hiring_hall.errors.required'
            )
          ),
        }
      ),
    }),
  }),
}

export default Union
