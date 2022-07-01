import { NextPage } from 'next'

import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import TextField from 'components/form/fields/TextField/TextField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
// import { useClearFields } from 'hooks/useClearFields' TODO: add hook file when formik wrapper is set
import { noop } from 'helpers/noop/noop'

export const Union: NextPage = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'union' })
  // const {
  //   values: { union },
  // } = useFormikContext<ClaimantInput>()
  //
  // const formData: ClaimantInput['union'] = union || {}

  // Remove conditional data if previous answer is changed
  // useClearFields(formData.is_union_member === false, [
  //   'union.union_name',
  //   'union.union_local_number',
  //   'union.required_to_seek_work_through_hiring_hall',
  // ])

  return (
    <Formik initialValues={{}} onSubmit={noop}>
      <>
        <YesNoQuestion
          question={t('is_union_member.label')}
          name="union.is_union_member"
        />
        {/*{formData.is_union_member === true && (*/}
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
        {/*)}*/}
      </>
    </Formik>
  )
}

// const pageSchema = (t: TFunction<"claimForm">) =>
//   yup.object().shape({
//     union: yup.object().shape({
//       is_union_member: yup
//         .boolean()
//         .required(t("union.is_union_member.required")),
//       union_name: yup.string().when("is_union_member", {
//         is: true,
//         then: yup.string().max(32).required(t("union.union_name.required")),
//       }),
//       union_local_number: yup.string().when("is_union_member", {
//         is: true,
//         then: yup
//           .string()
//           .max(16)
//           .required(t("union.union_local_number.required")),
//       }),
//       required_to_seek_work_through_hiring_hall: yup
//         .boolean()
//         .when("is_union_member", {
//           is: true,
//           then: yup
//             .boolean()
//             .required(
//               "union.required_to_seek_work_through_hiring_hall.required"
//             ),
//         }),
//     }),
//   });

export default Union
