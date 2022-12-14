import { useTranslation } from 'next-i18next'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'
import { formatLast18monthsEmployersDate } from 'utils/date/format'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import {
  Alert,
  Fieldset,
  SummaryBox,
  SummaryBoxContent,
} from '@trussworks/react-uswds'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import { RecentEmployersPageDefinition } from 'constants/pages/definitions/recentEmployersPageDefinition'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { ReactNode, useMemo } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { Routes } from 'constants/routes'
import { EditEmployerPageDefinition } from 'constants/pages/definitions/editEmployerPageDefinition'

const pageDefinition = RecentEmployersPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

export const RecentEmployers: NextPageWithLayout = () => {
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

        const firstImportedEmployerIndex = values?.employers?.findIndex(
          (employer) => {
            return employer.is_employer && employer.is_imported
          }
        )

        const { nextPageLocal, nextStep } = useMemo(() => {
          if (firstImportedEmployerIndex === -1) {
            return { nextPageLocal: nextPage.path, nextStep: nextPage.heading }
          }
          return {
            nextPageLocal: `${Routes.CLAIM.EDIT_EMPLOYER}/${firstImportedEmployerIndex}`,
            nextStep: EditEmployerPageDefinition.heading,
          }
        }, [firstImportedEmployerIndex])

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
                ?.filter((employer) => employer.is_imported)
                .map((employer, index) => {
                  return (
                    <div key={index}>
                      <YesNoQuestion
                        name={`employers[${index}].is_employer`}
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
                      {employer.is_employer === false && (
                        <Alert headingLevel="h3" slim={true} type="warning">
                          {t('recent_employers.confirm_employer')}
                        </Alert>
                      )}
                    </div>
                  )
                })}
            </Fieldset>
            <ClaimFormButtons nextStep={nextStep}>
              <BackButton previousPage={previousPage.path} />
              <NextButton nextPage={nextPageLocal} />
            </ClaimFormButtons>
          </>
        )
      }}
    </ClaimFormik>
  )
}

RecentEmployers.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default RecentEmployers
