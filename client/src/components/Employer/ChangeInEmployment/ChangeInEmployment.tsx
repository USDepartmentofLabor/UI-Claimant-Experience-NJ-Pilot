import { Fieldset } from '@trussworks/react-uswds'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { changeInEmploymentOptions } from 'constants/formOptions'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'
import { useClearFields } from 'hooks/useClearFields'
import { ClaimantInput } from 'types/claimantInput'
import { ChangeEventHandler } from 'react'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'

interface IEmployer {
  index: string
}

export const ChangeInEmployment = ({ index }: IEmployer) => {
  const { values } = useFormikContext<ClaimantInput>()
  const { clearField } = useClearFields()
  const handleReasonChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === 'yes') {
      clearField(`employers[${index}].employer_is_sole_proprietorship`)

      clearField('preferred_language')
      clearField('preferred_language_other')
    }
    console.log('fill this in')
  }
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  const showExpectRecall =
    values.employers?.[parseInt(index)].separation_circumstance === 'laid_off'
  return (
    <>
      <div>
        <Fieldset legend={<b>{t('separation.reasons.heading')} </b>}>
          <RadioField
            name={'employers[${index}].separation_circumstance'}
            options={changeInEmploymentOptions.map((option) => {
              return {
                label: t(`separation.reasons.${option}.label`),
                labelDescription: index,
                // t('separation.reasons.${option}.description'),
                value: option,
              }
            })}
            onChange={handleReasonChange}
          />
        </Fieldset>
        <DateInputField
          name={'employers[${index}].employment_start_date'}
          legend={t('employment_start_date.label')}
        />
        <DateInputField
          name={'employers[${index}].employment_last_date'}
          legend={t('employment_last_date.label')}
        />

        {showExpectRecall && (
          <Fieldset>
            <YesNoQuestion
              question={t('separation.expect_to_be_recalled.label')}
              name={'employers[${index}].expect_to_be_recalled'}
            />
          </Fieldset>
        )}
      </div>
    </>
  )
}
