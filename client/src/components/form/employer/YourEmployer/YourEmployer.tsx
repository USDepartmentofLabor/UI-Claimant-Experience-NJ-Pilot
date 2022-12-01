import { useTranslation } from 'react-i18next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'

interface IEmployer {
  index: string
}

export const YourEmployer = ({ index }: IEmployer) => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  return (
    <>
      <div>
        <h2 className="font-heading-sm">{t('your_employer.heading')} </h2>
        <YesNoQuestion
          name={`employers[${index}].is_full_time`}
          question={t('your_employer.is_full_time.label')}
          hint={t('your_employer.is_full_time.help_text')}
          yesLabel={t('your_employer.is_full_time.options.full_time')}
          noLabel={t('your_employer.is_full_time.options.part_time')}
          isStacked
        />
      </div>
    </>
  )
}
