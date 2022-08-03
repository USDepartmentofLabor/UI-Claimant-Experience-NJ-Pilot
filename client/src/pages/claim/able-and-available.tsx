import { NextPage } from 'next'
import { boolean, date, mixed, object, ref } from 'yup'
import { useFormikContext } from 'formik'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
  Fieldset,
} from '@trussworks/react-uswds'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { disabilityTypeOptions } from 'constants/formOptions'
import { ClaimantInput } from 'types/claimantInput'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { i18n_claimForm } from 'i18n/i18n'
import { Routes } from 'constants/routes'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import { yupDate } from 'validations/yup/custom'
import { useClearFields } from 'hooks/useClearFields'
import formStyles from 'components/form/form.module.scss'

export const AbleAndAvailable: NextPage = () => {
  const { values } = useFormikContext<ClaimantInput>()
  const { t } = useTranslation('claimForm')
  const { clearFields } = useClearFields()

  const handleHasCollectedDisabilityChange = () => {
    if (!values.able_and_available?.has_collected_disability) {
      clearFields([
        'able_and_available.disabled_immediately_before',
        'able_and_available.type_of_disability',
        'able_and_available.date_disability_began',
        'able_and_available.recovery_date',
        'able_and_available.contacted_last_employer_after_recovery',
      ])
    }
  }

  return (
    <>
      <SummaryBox>
        <SummaryBoxHeading headingLevel="h2">
          {t('able_and_available.info_alert.title')}
        </SummaryBoxHeading>
        <SummaryBoxContent>
          <ul>
            <li>{t('able_and_available.info_alert.items.fli')}</li>
            <li>{t('able_and_available.info_alert.items.leave')}</li>
            <li>{t('able_and_available.info_alert.items.tdi')}</li>
            <li>{t('able_and_available.info_alert.items.workers_comp')}</li>
            <li>{t('able_and_available.info_alert.items.doctor_cert')}</li>
          </ul>
        </SummaryBoxContent>
      </SummaryBox>
      <YesNoQuestion
        name={'able_and_available.can_begin_work_immediately'}
        question={t('able_and_available.can_begin_work_immediately.label')}
      />
      <YesNoQuestion
        question={t('able_and_available.has_collected_disability.label')}
        name="able_and_available.has_collected_disability"
        hint={t('able_and_available.has_collected_disability.help_text')}
        onChange={handleHasCollectedDisabilityChange}
      />
      {values.able_and_available?.has_collected_disability && (
        <>
          <YesNoQuestion
            question={t('able_and_available.disabled_immediately_before.label')}
            name="able_and_available.disabled_immediately_before"
          />
          <Fieldset
            legend={t('able_and_available.type_of_disability.label')}
            className={formStyles.field}
          >
            <RadioField
              name="able_and_available.type_of_disability"
              options={disabilityTypeOptions.map((option) => {
                return {
                  label: t(
                    `able_and_available.type_of_disability.options.${option}`
                  ),
                  value: option,
                }
              })}
            />
          </Fieldset>
          <DateInputField
            name="able_and_available.date_disability_began"
            legend={t('able_and_available.date_disability_began.label')}
          />
          <DateInputField
            name="able_and_available.recovery_date"
            legend={t('able_and_available.recovery_date.label')}
            hint={t('able_and_available.recovery_date.help_text')}
          />
          <YesNoQuestion
            question={t(
              'able_and_available.contacted_last_employer_after_recovery.label'
            )}
            name="able_and_available.contacted_last_employer_after_recovery"
          />
        </>
      )}
    </>
  )
}

const validationSchema = object().shape({
  able_and_available: object().shape({
    can_begin_work_immediately: boolean().required(
      i18n_claimForm.t(
        'able_and_available.can_begin_work_immediately.errors.required'
      )
    ),
    has_collected_disability: boolean().required(
      i18n_claimForm.t(
        'able_and_available.has_collected_disability.errors.required'
      )
    ),
    disabled_immediately_before: boolean().when('has_collected_disability', {
      is: true,
      then: boolean().required(
        i18n_claimForm.t(
          'able_and_available.disabled_immediately_before.errors.required'
        )
      ),
    }),
    type_of_disability: mixed()
      .oneOf([...disabilityTypeOptions])
      .when('has_collected_disability', {
        is: true,
        then: mixed().required(
          i18n_claimForm.t(
            'able_and_available.type_of_disability.errors.required'
          )
        ),
      }),
    date_disability_began: yupDate(
      i18n_claimForm.t('able_and_available.date_disability_began.label')
    )
      .max(
        dayjs(new Date()).format('YYYY-MM-DD'),
        i18n_claimForm.t(
          'able_and_available.date_disability_began.errors.maxDate'
        )
      )
      .when('has_collected_disability', {
        is: true,
        then: (schema) =>
          schema.required(
            i18n_claimForm.t(
              'able_and_available.date_disability_began.errors.required'
            )
          ),
      }),

    recovery_date: yupDate(
      i18n_claimForm.t('able_and_available.recovery_date.label')
    )
      .max(
        dayjs(new Date()).format('YYYY-MM-DD'),
        i18n_claimForm.t('able_and_available.recovery_date.errors.maxDate')
      )
      .when('date_disability_began', {
        is: (dateValue: string | undefined) => !!dateValue,
        then: date().min(
          ref('date_disability_began'),
          i18n_claimForm.t('able_and_available.recovery_date.errors.minDate')
        ),
      })
      .when('has_collected_disability', {
        is: true,
        then: (schema) =>
          schema.required(
            i18n_claimForm.t('able_and_available.recovery_date.errors.required')
          ),
      }),
    contacted_last_employer_after_recovery: boolean().when(
      'has_collected_disability',
      {
        is: true,
        then: boolean().required(
          i18n_claimForm.t(
            'able_and_available.contacted_last_employer_after_recovery.errors.required'
          )
        ),
      }
    ),
  }),
})

export const AbleAndAvailablePageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('able_and_available.heading'),
  path: Routes.CLAIM.ABLE_AND_AVAILABLE,
  initialValues: { able_and_available: {} },
  validationSchema,
}

export default AbleAndAvailable
