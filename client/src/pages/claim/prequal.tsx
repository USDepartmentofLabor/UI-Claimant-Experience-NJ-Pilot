import { NextPage } from 'next'

import { useFormikContext } from 'formik'
import { useTranslation } from 'react-i18next'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { useClearFields } from 'hooks/useClearFields'
import { ClaimantInput } from 'types/claimantInput'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { boolean, object, string } from 'yup'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import styles from 'styles/pages/claim/prequal.module.scss'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { statesProvincesAndTerritories } from 'fixtures/states_provinces_territories'
import { ChangeEventHandler } from 'react'

const stateProvincesTerritoriesDropdownOptions = Object.entries(
  statesProvincesAndTerritories
).map(([key, value]) => ({ label: value, value: key }))

export const Prequal: NextPage = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'prequal' })
  const { values } = useFormikContext<ClaimantInput>()
  const { clearField } = useClearFields()

  const handleFiledInLast12MonthsChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value === 'no') {
      clearField('state_province_territory_where_filed')
    }
  }

  const handleLivedOutsideOfNewJerseyChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value === 'no') {
      clearField('will_look_for_work_in_nj')
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
      <YesNoQuestion
        question={t('federal_work_in_last_18mo.label')}
        name="federal_work_in_last_18mo"
      />
    </>
  )
}

export const PrequalPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('prequal.heading'),
  path: Routes.CLAIM.PREQUAL,
  initialValues: {
    filed_in_last_12mo: undefined,
    state_province_territory_where_filed: undefined,
    lived_outside_nj_when_working_nj: undefined,
    will_look_for_work_in_nj: undefined,
    can_begin_work_immediately: undefined,
    federal_work_in_last_18mo: undefined,
  },
  validationSchema: object().shape({
    filed_in_last_12mo: boolean().required(
      i18n_claimForm.t('prequal.filed_in_last_12mo.errors.required')
    ),
    state_province_territory_where_filed: string().when('filed_in_last_12mo', {
      is: true,
      then: string()
        .oneOf([
          ...stateProvincesTerritoriesDropdownOptions.map(({ value }) => value),
        ])
        .required(
          i18n_claimForm.t(
            'prequal.state_province_territory_where_filed.errors.required'
          )
        ),
    }),
    lived_outside_nj_when_working_nj: boolean().required(
      i18n_claimForm.t(
        'prequal.lived_outside_nj_when_working_nj.errors.required'
      )
    ),
    will_look_for_work_in_nj: boolean().when(
      'lived_outside_nj_when_working_nj',
      {
        is: true,
        then: boolean().required(
          i18n_claimForm.t('prequal.will_look_for_work_in_nj.errors.required')
        ),
      }
    ),
    can_begin_work_immediately: boolean().required(
      i18n_claimForm.t('prequal.can_begin_work_immediately.errors.required')
    ),
    federal_work_in_last_18mo: boolean().required(
      i18n_claimForm.t('prequal.federal_work_in_last_18mo.errors.required')
    ),
  }),
}

export default Prequal
