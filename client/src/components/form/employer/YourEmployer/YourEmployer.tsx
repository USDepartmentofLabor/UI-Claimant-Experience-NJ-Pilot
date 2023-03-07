import { useTranslation } from 'react-i18next'

import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import Address from 'components/form/Address/Address'
import TextField from 'components/form/fields/TextField/TextField'
import { useFormikContext } from 'formik'
import { Employer } from 'types/claimantInput'
import { PhoneNumberField } from 'components/form/PhoneNumberField/PhoneNumberField'
import { ChangeEventHandler } from 'react'
import { formatFein } from 'utils/employer/employerUtils'
import { useClearFields } from 'hooks/useClearFields'
import { EMPLOYER_SKELETON } from 'components/form/EditEmployer/EditEmployer'
import { STATE_EMPLOYER_PAYROLL_NUMBER_VALUE } from 'constants/formOptions'

export const YourEmployer = () => {
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })
  const { values } = useFormikContext<Employer>()
  const { clearField } = useClearFields()

  const importedEmployer = values?.is_imported === true
  const myLabels = {
    address: t('your_employer.employer_address.address.label'),
    address2: t('your_employer.employer_address.address2.label'),
    address3: t('your_employer.employer_address.address3.label'),
    city: t('your_employer.employer_address.city.label'),
    state: t('your_employer.employer_address.state.label'),
    zipcode: t('your_employer.employer_address.zipcode.label'),
  }

  const showStateEmployerPayrollNumber =
    formatFein(values.fein) === STATE_EMPLOYER_PAYROLL_NUMBER_VALUE
  const handleFEINChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (formatFein(e.target.value) !== STATE_EMPLOYER_PAYROLL_NUMBER_VALUE) {
      await clearField(
        'state_employer_payroll_number',
        EMPLOYER_SKELETON.state_employer_payroll_number
      )
    }
  }

  return (
    <>
      <div>
        <h2 className="font-heading-sm margin-top-4">
          {t('your_employer.heading')}
        </h2>
        {!importedEmployer && (
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
              onChange={handleFEINChange}
              maxLength={15}
            />
            {showStateEmployerPayrollNumber && (
              <TextField
                name={'state_employer_payroll_number'}
                label={t('your_employer.state_employer_payroll_number.label')}
                hint={t('your_employer.state_employer_payroll_number.hint')}
                type="text"
                data-testid={t('your_employer.state_employer_payroll_number')}
                maxLength={7}
              />
            )}
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
              optAddress2
              optAddress3
            />
            <PhoneNumberField
              name="employer_phone"
              label={t('your_employer.employer_phone.label')}
              showSMS={false}
            />
          </>
        )}
        {importedEmployer && (
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
