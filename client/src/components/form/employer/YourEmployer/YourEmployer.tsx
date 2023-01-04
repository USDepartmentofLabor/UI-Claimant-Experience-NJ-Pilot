import { useTranslation } from 'react-i18next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import Address from 'components/form/Address/Address'
import TextField from 'components/form/fields/TextField/TextField'
import { useFormikContext } from 'formik'
import { Employer } from 'types/claimantInput'

export const YourEmployer = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  const { values } = useFormikContext<Employer>()

  const importedEmployer = values?.is_imported === false
  const myLabels = {
    address: t('your_employer.employer_address.address.label'),
    address2: t('your_employer.employer_address.address2.label'),
    address3: t('your_employer.employer_address.address3.label'),
    city: t('your_employer.employer_address.city.label'),
    state: t('your_employer.employer_address.state.label'),
    zipcode: t('your_employer.employer_address.zipcode.label'),
  }

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
            <YesNoQuestion
              name={`is_full_time`}
              question={t('your_employer.is_full_time.label')}
              hint={t('your_employer.is_full_time.help_text')}
              yesLabel={t('your_employer.is_full_time.options.full_time')}
              noLabel={t('your_employer.is_full_time.options.part_time')}
              isStacked
            />
            <Address
              basename={'employer_address'}
              labels={myLabels}
              optAddress2={true}
              optAddress3={true}
            />
          </>
        )}
        {!importedEmployer && (
          <YesNoQuestion
            name={`is_full_time`}
            question={t('your_employer.is_full_time.label')}
            hint={t('your_employer.is_full_time.help_text')}
            yesLabel={t('your_employer.is_full_time.options.full_time')}
            noLabel={t('your_employer.is_full_time.options.part_time')}
            isStacked
          />
        )}
      </div>
    </>
  )
}
