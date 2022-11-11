import { useTranslation } from 'react-i18next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { Fieldset } from '@trussworks/react-uswds'

interface IEmployer {
  index: string
}

export const YourEmployer = ({ index }: IEmployer) => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'your_employer' })
  return (
    <>
      <div>
        <Fieldset legend={<b>{t('heading')} </b>}>
          <YesNoQuestion
            name={`employers[${index}].is_full_time`}
            question={t('is_full_time.label')}
            hint={t('is_full_time.help_text')}
            yesLabel={t('is_full_time.options.full_time')}
            noLabel={t('is_full_time.options.part_time')}
            is_stacked={true}
          />
        </Fieldset>
      </div>
    </>
  )
}
