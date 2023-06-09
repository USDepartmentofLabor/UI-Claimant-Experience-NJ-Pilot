import { useTranslation } from 'react-i18next'
import TextField from 'components/form/fields/TextField/TextField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { UnionInput } from 'types/claimantInput'
import { NextPageWithLayout } from 'pages/_app'
import { ReactNode, ChangeEventHandler } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { UnionPageDefinition } from 'constants/pages/definitions/unionPageDefinition'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import { UNTOUCHED_RADIO_VALUE } from 'constants/formOptions'

const pageDefinition = UnionPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const pageInitialValues = {
  required_to_seek_work_through_hiring_hall: UNTOUCHED_RADIO_VALUE,
  union_name: '',
  union_local_number: '',
}

export const Union: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'union' })

  return (
    <ClaimFormik<UnionInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values, clearFields }) => {
        const handleSeekWorkThroughHiringHallChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          // Remove conditional data if previous answer is changed
          if (e.target.value === 'no') {
            await clearFields({
              union_name: pageInitialValues.union_name,
              union_local_number: pageInitialValues.union_local_number,
            })
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
                  inputMode="numeric"
                  name="union_local_number"
                />
              </>
            )}
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

Union.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Union
