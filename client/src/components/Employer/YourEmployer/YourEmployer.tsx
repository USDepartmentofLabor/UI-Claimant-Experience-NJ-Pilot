import { useTranslation } from 'react-i18next'

import { i18n_claimForm } from 'i18n/i18n'
import { boolean, object } from 'yup'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { Fieldset } from '@trussworks/react-uswds'

interface IEmployer {
  employerIndex: number
}
export const initialValues = {
  is_full_time: undefined,
}
export const validationSchema = object().shape({
  is_full_time: boolean().required(
    i18n_claimForm.t('your_employer.is_full_time')
  ),
})
export const YourEmployer = ({ employerIndex }: IEmployer) => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'your_employer' })
  return (
    <>
      <div>
        <Fieldset legend={<b>{t('heading')} </b>}>
          <YesNoQuestion
            name={`employers[${employerIndex}].is_full_time`}
            question={t('is_full_time.label')}
            hint={t('is_full_time.help_text')}
            yesLabel={t('is_full_time.options.full_time')}
            noLabel={t('is_full_time.options.part_time')}
          />
        </Fieldset>
      </div>
    </>
  )
}
