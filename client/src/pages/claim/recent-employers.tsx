import { useTranslation } from 'next-i18next'
import {
  Fieldset,
  SummaryBox,
  SummaryBoxContent,
} from '@trussworks/react-uswds'

import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { Alert } from '@trussworks/react-uswds'
import { formatLast18monthsEmployersDate } from 'utils/date/format'
import { NextPageWithLayout } from 'pages/_app'
import { ReactNode } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { RecentEmployersPageDefinition } from 'constants/pages/definitions/recentEmployersPageDefinition'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import { getNextPage, getPreviousPage } from 'constants/pages/pageDefinitions'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'

const pageDefinition = RecentEmployersPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const RecentEmployers: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')
  const { data } = useGetRecentEmployers()
  const date = formatLast18monthsEmployersDate(String(new Date()))

  return (
    <ClaimFormik
      initialValues={pageDefinition.initialValues}
      validationSchema={pageDefinition.validationSchema}
    >
      {({ values }) => {
        if (!values.employers?.length) {
          values.employers = data
        }

        return (
          <>
            <SummaryBox>
              <SummaryBoxContent>
                {t('recent_employers.preamble')}
              </SummaryBoxContent>
            </SummaryBox>
            <Fieldset
              legend={<b>{t('recent_employers.question', { date })}</b>}
            >
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
            <ClaimFormButtons nextStep={nextPage.heading}>
              <BackButton previousPage={previousPage.path} />
              <NextButton nextPage={nextPage.path} />
            </ClaimFormButtons>
          </>
        )
      }}
    </ClaimFormik>
  )
}

RecentEmployers.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout pageDefinition={pageDefinition}>{page}</ClaimFormLayout>
  )
}

export default RecentEmployers
