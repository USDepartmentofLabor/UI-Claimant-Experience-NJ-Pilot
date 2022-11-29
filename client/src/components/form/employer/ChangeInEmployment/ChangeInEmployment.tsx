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
    if (e.target.value === 'still_employed') {
      clearField(`employers[${index}].employment_last_date`)
    }
  }
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })

  const employer = values.employers?.[parseInt(index)]
  const showStillEmployed =
    employer?.separation_circumstance === 'still_employed'
  const showLastDay =
    employer?.separation_circumstance !== undefined && !showStillEmployed

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
          <Fieldset legend={t('separation.reasons.still_employed.label')}>
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
            />
          </Fieldset>
        )}
        <DateInputField
          name={`employers[${index}].employment_start_date`}
          legend={t('employment_start_date.label')}
        />
        {showLastDay && (
          <DateInputField
            name={`employers[${index}].employment_last_date`}
            legend={t('employment_last_date.label')}
          />
        )}
        {showStillEmployed && (
          <YesNoQuestion
            question={t('hours_reduced_twenty_percent.label')}
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
