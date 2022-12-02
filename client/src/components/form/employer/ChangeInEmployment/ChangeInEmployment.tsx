import { Fieldset, Link } from '@trussworks/react-uswds'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import {
  changeInEmploymentOptions,
  reasonStillEmployedOptions,
} from 'constants/formOptions'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'

import { ClaimantInput } from 'types/claimantInput'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import { Trans } from 'react-i18next'

import { ChangeEventHandler } from 'react'
import { useClearFields } from 'hooks/useClearFields'

interface IEmployer {
  index: string
}

export const ChangeInEmployment = ({ index }: IEmployer) => {
  const { values } = useFormikContext<ClaimantInput>()

  const { clearField } = useClearFields()
  const handleReasonChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value !== 'still_employed') {
      clearField(`employers[${index}].reason_still_employed`)
      clearField(`employers[${index}].hours_reduced_twenty_percent`)
    }
  }
  const handleStillEmployedReasonChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value !== 'reduction_in_hours_by_employer') {
      clearField(`employers[${index}].hours_reduced_twenty_percent`)
    }
  }
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })

  const employer = values.employers?.[parseInt(index)]
  const showStillEmployed =
    employer?.separation_circumstance === 'still_employed'
  const showHoursReducedPercentage =
    showStillEmployed &&
    employer?.reason_still_employed === 'reduction_in_hours_by_employer'

  return (
    <>
      <div>
        <p>
          <strong>{t('separation.heading')}</strong>
        </p>
        <Fieldset legend={t('separation.reason.label')}>
          <RadioField
            name={`employers[${index}].separation_circumstance`}
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
        </Fieldset>
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
          <Fieldset
            legend={t('separation.reasons.still_employed.option_heading')}
          >
            <RadioField
              name={`employers[${index}].reason_still_employed`}
              options={reasonStillEmployedOptions.map((option) => {
                return {
                  label: t(
                    `separation.reasons.still_employed.options.${option}`
                  ),
                  value: option,
                }
              })}
              onChange={handleStillEmployedReasonChange}
            />
          </Fieldset>
        )}
        <DateInputField
          name={`employers[${index}].employment_start_date`}
          legend={t('employment_start_date.label')}
        />
        <DateInputField
          name={`employers[${index}].employment_last_date`}
          legend={t('employment_last_date.label')}
          //TODO - uncomment if hint is added back in,
          //     remove if decide not to have a hint
          // hint={showStillEmployed ? t('employment_last_date.hint') : undefined}
        />
        {showHoursReducedPercentage && (
          <YesNoQuestion
            question={t('hours_reduced_twenty_percent.label')}
            hint={t('hours_reduced_twenty_percent.hint')}
            name={`employers[${index}].hours_reduced_twenty_percent`}
          />
        )}
        <YesNoQuestion
          question={t('separation.expect_to_be_recalled.label')}
          name={`employers[${index}].expect_to_be_recalled`}
        />
      </div>
    </>
  )
}
