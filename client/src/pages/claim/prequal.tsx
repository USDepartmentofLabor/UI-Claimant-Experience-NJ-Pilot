import { useTranslation } from 'react-i18next'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import styles from 'styles/pages/claim/prequal.module.scss'
import { NextPageWithLayout } from 'pages/_app'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { ReactNode } from 'react'
import { PrequalPageDefinition } from 'constants/pages/definitions/prequalPageDefinition'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import { getNextPage, pageDefinitions } from 'constants/pages/pageDefinitions'
import { PrequalInput } from 'types/claimantInput'
import { ChangeEventHandler } from 'react'
import DropdownField, {
  DropdownOption,
} from 'components/form/fields/DropdownField/DropdownField'
import { statesTerritoriesAndProvinces } from 'fixtures/states_territories_provinces'

const stateProvincesTerritoriesDropdownOptions: Record<
  string,
  DropdownOption[]
> = {}

Object.entries(statesTerritoriesAndProvinces).forEach(
  ([groupName, entries]) => {
    stateProvincesTerritoriesDropdownOptions[`${groupName}`] = Object.entries(
      entries
    ).map(([abbr, name]) => ({
      label: name,
      value: abbr,
    }))
  }
)

const pageDefinition = PrequalPageDefinition
const nextPage = getNextPage(pageDefinition)

export const Prequal: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'prequal' })

  return (
    <ClaimFormik<PrequalInput>
      initialValues={pageDefinition.initialValues}
      validationSchema={pageDefinition.validationSchema}
    >
      {({ values, clearField }) => {
        const handleFiledInLast12MonthsChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'no') {
            await clearField('state_province_territory_where_filed')
          }
        }

        const handleLivedOutsideOfNewJerseyChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'no') {
            await clearField('will_look_for_work_in_nj')
          }
        }

        return (
          <>
            <YesNoQuestion
              question={t('filed_in_last_12mo.label')}
              name="filed_in_last_12mo"
              onChange={handleFiledInLast12MonthsChange}
            />
            {values.filed_in_last_12mo === true && (
              <DropdownField
                name="state_province_territory_where_filed"
                label={t('state_province_territory_where_filed.label')}
                data-testid="state_province_territory_where_filed"
                startEmpty
                options={stateProvincesTerritoriesDropdownOptions}
                formGroupClassName={styles.state}
              />
            )}
            <YesNoQuestion
              question={t('lived_outside_nj_when_working_nj.label')}
              name="lived_outside_nj_when_working_nj"
              onChange={handleLivedOutsideOfNewJerseyChange}
            />
            {values.lived_outside_nj_when_working_nj === true && (
              <YesNoQuestion
                question={t('will_look_for_work_in_nj.label')}
                name="will_look_for_work_in_nj"
              />
            )}
            <YesNoQuestion
              question={t('can_begin_work_immediately.label')}
              name="can_begin_work_immediately"
            />
            <ClaimFormButtons nextStep={nextPage.heading}>
              <NextButton nextPage={nextPage.path} />
            </ClaimFormButtons>
          </>
        )
      }}
    </ClaimFormik>
  )
}

Prequal.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Prequal
