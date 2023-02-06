import { Link } from '@trussworks/react-uswds'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import {
  changeInEmploymentOptions,
  reasonStillEmployedOptions,
} from 'constants/formOptions'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'

import { Employer } from 'types/claimantInput'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import { TextAreaField } from 'components/form/fields/TextAreaField/TextAreaField'
import { Trans } from 'react-i18next'

import { ChangeEventHandler } from 'react'
import { useClearFields } from 'hooks/useClearFields'

export const ChangeInEmployment = () => {
  const { values } = useFormikContext<Employer>()
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })

  const showComment = [
    'fired_discharged_suspended',
    'unsatisfactory_work_performance',
    'quit_or_retired',
    'strike_or_lock_out_by_employer',
  ].includes(values.separation_circumstance ?? '')
  const showRecallQuestions = values.expect_to_be_recalled === true
  const showDefiniteRecall =
    values.expect_to_be_recalled === true && values.definite_recall === true
  const showDischargeDate =
    values.separation_circumstance === 'fired_discharged_suspended'
  const showStillEmployed = values.separation_circumstance === 'still_employed'
  const showHoursReducedPercentage =
    showStillEmployed &&
    values.reason_still_employed === 'reduction_in_hours_by_employer'
  const { clearField } = useClearFields()
  const handleReasonChange: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (
      ![
        'fired_discharged_suspended',
        'unsatisfactory_work_performance',
        'quit_or_retired',
        'strike_or_lock_out_by_employer',
      ].includes(values.separation_circumstance ?? '')
    ) {
      await clearField('separation_circumstance_details')
      await clearField('discharge_date')
    }
    if (e.target.value !== 'fired_discharged_suspended') {
      await clearField(`discharge_date`)
    }
    if (e.target.value !== 'still_employed') {
      await clearField(`reason_still_employed`)
      await clearField(`hours_reduced_twenty_percent`)
    }
  }
  const handleExpectRecallChange: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.target.value === 'no') {
      await clearField('definite_recall')
      await clearField('is_seasonal_work')
      await clearField('definite_recall_date')
    }
  }
  const handleHasDefiniteRecallChange: ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.value === 'no') {
      await clearField('definite_recall_date')
    }
  }
  const handleStillEmployedReasonChange: ChangeEventHandler<
    HTMLSelectElement
  > = async (e) => {
    if (e.target.value !== 'reduction_in_hours_by_employer') {
      await clearField(`hours_reduced_twenty_percent`)
    }
  }

  return (
    <>
      <div>
        <p>
          <strong>{t('separation.heading')}</strong>
        </p>
        <RadioField
          name={`separation_circumstance`}
          legend={t('separation.reason.label')}
          tile={true}
          options={changeInEmploymentOptions.map((option) => {
            return {
              label: t(`separation.reasons.${option}.label`),
              labelDescription: t(`separation.reasons.${option}.description`),
              value: option,
            }
          })}
          onChange={handleReasonChange}
        />
        <div className="usa-alert usa-alert--info usa-alert--validation">
          <div className="usa-alert__body">
            <Trans t={t} i18nKey="separation.info_alert.description">
              <Link
                variant="external"
                href={t('separation.info_alert.website')}
              >
                {''}
              </Link>
            </Trans>
          </div>
        </div>
        {showStillEmployed && (
          <DropdownField
            startEmpty
            name={`reason_still_employed`}
            label={t('separation.reasons.still_employed.option_heading')}
            options={reasonStillEmployedOptions.map((option) => {
              return {
                label: t(`separation.reasons.still_employed.options.${option}`),
                value: option,
              }
            })}
            onChange={handleStillEmployedReasonChange}
          />
        )}
        {showComment && (
          <TextAreaField
            label={t(
              'separation.separation_circumstance_details.required_label'
            )}
            name={`separation_circumstance_details`}
          />
        )}
        <DateInputField
          name={`employment_start_date`}
          legend={t('employment_start_date.label')}
        />
        <DateInputField
          name={`employment_last_date`}
          legend={t('employment_last_date.label')}
          //TODO - uncomment if hint is added back in,
          //     remove if decide not to have a hint
          // hint={showStillEmployed ? t('employment_last_date.hint') : undefined}
        />
        {showHoursReducedPercentage && (
          <YesNoQuestion
            question={t('hours_reduced_twenty_percent.label')}
            hint={t('hours_reduced_twenty_percent.hint')}
            name={`hours_reduced_twenty_percent`}
          />
        )}
        {showDischargeDate && (
          <DateInputField
            name={`discharge_date`}
            legend={t('discharge_date.label')}
          />
        )}
        <YesNoQuestion
          question={t('separation.expect_to_be_recalled.label')}
          name={`expect_to_be_recalled`}
          onChange={handleExpectRecallChange}
        />
        {showRecallQuestions && (
          <YesNoQuestion
            question={t('separation.definite_recall.label')}
            name={`definite_recall`}
            onChange={handleHasDefiniteRecallChange}
          />
        )}
        {showDefiniteRecall && (
          <DateInputField
            name={`definite_recall_date`}
            legend={t('separation.definite_recall_date.label')}
          />
        )}
        {showRecallQuestions && (
          <YesNoQuestion
            question={t('separation.is_seasonal_work.label')}
            name={`is_seasonal_work`}
          />
        )}
      </div>
    </>
  )
}
