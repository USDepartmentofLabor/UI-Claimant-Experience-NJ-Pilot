import { Fieldset, Link } from '@trussworks/react-uswds'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { changeInEmploymentOptions } from 'constants/formOptions'
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
  const showLastDay = employer?.separation_circumstance !== undefined
  employer?.separation_circumstance !== 'still_employed'

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
        <YesNoQuestion
          question={t('separation.expect_to_be_recalled.label')}
          name={`employers[${index}].expect_to_be_recalled`}
        />
      </div>
    </>
  )
}
