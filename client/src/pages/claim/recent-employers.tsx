import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import {
  Fieldset,
  SummaryBox,
  SummaryBoxContent,
} from '@trussworks/react-uswds'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { ClaimantInput } from 'types/claimantInput'
import { object, array, boolean } from 'yup'
import { Routes } from 'constants/routes'
import { i18n_claimForm } from 'i18n/i18n'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'
import { useFormikContext } from 'formik'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { Alert } from '@trussworks/react-uswds'
import { formatLast18monthsEmployersDate } from '../../utils/date/format'

const RecentEmployers: NextPage = () => {
  const { t } = useTranslation('claimForm')
  const { data } = useGetRecentEmployers()
  const date = formatLast18monthsEmployersDate(String(new Date()))
  const { values } = useFormikContext<ClaimantInput>()

  if (!values.employers?.length) {
    values.employers = data
  }

  return (
    <>
      <SummaryBox>
        <SummaryBoxContent>{t('recent_employers.preamble')}</SummaryBoxContent>
      </SummaryBox>
      <Fieldset legend={<b>{t('recent_employers.question', { date })}</b>}>
        {values.employers
          ?.filter((employer) => employer.isImported)
          .map((employer, index) => {
            return (
              <div key={index}>
                <YesNoQuestion
                  name={`employers[${index}].isEmployer`}
                  question={
                    <>
                      <span className="screen-reader-only">
                        {t('recent_employers.work_at', {
                          employer: employer.name,
                        })}
                      </span>
                      <span aria-hidden={true}>{employer.name}</span>
                    </>
                  }
                />
                {employer.isEmployer === false && (
                  <Alert headingLevel="h3" slim={true} type="warning">
                    {t('recent_employers.confirm_employer')}
                  </Alert>
                )}
              </div>
            )
          })}
      </Fieldset>
    </>
  )
}

const validationSchema = object().shape({
  employers: array().of(
    object().shape({
      isImported: boolean(),
      isEmployer: boolean().when('isImported', {
        is: true,
        then: boolean().required(
          i18n_claimForm.t('recent_employers.isEmployer.errors.required')
        ),
      }),
    })
  ),
})

const previousPage = () => {
  return Routes.CLAIM.DEMOGRAPHICS
}

const nextPage = () => {
  return Routes.CLAIM.IDENTITY
}

export const RecentEmployersPageDefinition: PageDefinition = {
  heading: i18n_claimForm.t('recent_employers.heading'),
  path: Routes.CLAIM.RECENT_EMPLOYERS,
  initialValues: {},
  validationSchema: validationSchema,
  previousPage: previousPage,
  nextPage: nextPage,
}

export default RecentEmployers
