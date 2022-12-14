import { PageDefinition } from '../pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from '../../routes'
import { boolean, object, string } from 'yup'
import { statesTerritoriesAndProvinces } from 'fixtures/states_territories_provinces'

export const PrequalPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('prequal.heading'),
  path: Routes.CLAIM.PREQUAL,
  initialValues: {
    filed_in_last_12mo: undefined,
    state_province_territory_where_filed: undefined,
    lived_outside_nj_when_working_nj: undefined,
    will_look_for_work_in_nj: undefined,
    can_begin_work_immediately: undefined,
  },
  validationSchema: object().shape({
    filed_in_last_12mo: boolean().required(
      i18n_claimForm.t('prequal.filed_in_last_12mo.errors.required')
    ),
    state_province_territory_where_filed: string().when('filed_in_last_12mo', {
      is: true,
      then: string()
        .oneOf([
          ...Object.entries(statesTerritoriesAndProvinces).flatMap(
            ([, entries]) => Object.entries(entries).map(([abbr]) => abbr)
          ),
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
  }),
}
