import { useTranslation } from 'react-i18next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import TextField from 'components/form/fields/TextField/TextField'
import { useFormikContext } from 'formik'
import { Employer } from 'types/claimantInput'

export const YourEmployer = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  const { values } = useFormikContext<Employer>()

  const importedEmployer = values?.is_imported === false

  return (
    <>
      <div>
        <h2 className="font-heading-sm">{t('your_employer.heading')} </h2>
        {importedEmployer && (
          <>
            <TextField
              name={'employer_name'}
              label={t('your_employer.employer_name.label')}
              hint={t('your_employer.employer_name.hint')}
              type="text"
              data-testid={t('your_employer.employer_name')}
            />
            <TextField
              name={'fein'}
              label={t('your_employer.fein.label')}
              hint={t('your_employer.fein.hint')}
              type="text"
              data-testid={t('your_employer.fein')}
            />
          </>
        )}
        <YesNoQuestion
          name={`is_full_time`}
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
