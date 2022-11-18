import { Fieldset, Link } from '@trussworks/react-uswds'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { changeInEmploymentOptions } from 'constants/formOptions'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'

import { ClaimantInput } from 'types/claimantInput'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import { Trans } from 'next-i18next'

// import { ChangeEventHandler } from 'react'
// import { useClearFields } from 'hooks/useClearFields'

interface IEmployer {
  index: string
}
interface IChangeInEmploymentOptionText {
  description: string
  name: string
}

export const ChangeInEmployment = ({ index }: IEmployer) => {
  const { values } = useFormikContext<ClaimantInput>()
  //TODO - Uncomment clearfields and this seciton when completing
  //    the story for Still Emmployed or any others with conditionals
  // const { clearField } = useClearFields()
  // const handleReasonChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   if (e.target.value === 'still_employed') {
  //     clearField(`employers[${index}].employment_last_date`)
  //   }
  // }
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })

  const employer = values.employers?.[parseInt(index)]
  const showExpectRecall =
    employer?.separation_circumstance !== 'still_employed'

  const SeparationReasonLabel = (reason: IChangeInEmploymentOptionText) => {
    return (
      <>
        <span>{reason.name}</span>
        <span className="usa-checkbox__label-description">
          {reason.description}
        </span>
      </>
    )
  }
  return (
    <>
      <div>
        {<b>{t('separation.heading')} </b>}
        <Fieldset legend={t('separation.reason.label')}>
          <RadioField
            name={`employers[${index}].separation_circumstance`}
            tile={true}
            options={changeInEmploymentOptions.map((option) => {
              return {
                label: (
                  <SeparationReasonLabel
                    name={t(`separation.reasons.${option}.label`)}
                    description={t(`separation.reasons.${option}.description`)}
                  />
                ),
                labelDescription: index,
                tile: true,
                value: option,
              }
            })}
            // onChange={handleReasonChange} //uncomment when adding in additional fields
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
        {showExpectRecall && (
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
