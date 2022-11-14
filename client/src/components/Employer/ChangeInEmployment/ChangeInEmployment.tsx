import { useTranslation } from 'react-i18next'

import { Fieldset } from '@trussworks/react-uswds'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { changeInEmploymentOptions } from 'constants/formOptions'

interface IEmployer {
  index: string
}

export const ChangeInEmployment = ({ index }: IEmployer) => {
  const handleReasonChange = () => {
    // if (values.employers[parseInt(index)].separation_circumstance !== 'no_interpreter_tty') {
    //   clearField('preferred_language')
    //   clearField('preferred_language_other')
    // }
    console.log('fill this in')
  }
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
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
                // t('separation.reasons.${option}.label'),
                value: option,
              }
            })}
            onChange={handleReasonChange}
          />
        </Fieldset>
      </div>
    </>
  )
}
