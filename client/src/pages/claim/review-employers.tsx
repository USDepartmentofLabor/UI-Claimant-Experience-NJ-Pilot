import { useTranslation } from 'next-i18next'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import {
  Button,
  Link,
  SummaryBox,
  SummaryBoxContent,
} from '@trussworks/react-uswds'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { ReviewEmployersPageDefinition } from 'constants/pages/definitions/reviewEmployersPageDefinition'
import { EmployerFormik } from 'components/form/EmployerFormik/EmployerFormik'
import {
  EditEmployer,
  EMPLOYER_SKELETON,
  yupEditEmployer,
} from 'components/form/EditEmployer/EditEmployer'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { Trans } from 'react-i18next'
import { ReviewEmployersNextButton } from 'components/form/ClaimFormButtons/ReviewEmployerNextButton/ReviewEmployersNextButton'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import { Routes } from 'constants/routes'
import { findLastIndex } from 'lodash'
import { i18n_claimForm } from 'i18n/i18n'
import { EditEmployerPageDefinition } from 'constants/pages/definitions/editEmployerPageDefinition'
import { useSaveClaimFormValues } from 'hooks/useSaveClaimFormValues'
import { ClaimantInput } from 'types/claimantInput'

const pageDefinition = ReviewEmployersPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const pageInitialValues = { LOCAL_reviewed_employers: false }

const REVIEW = 'review'
const ADD = 'add'
const EDIT = 'edit'

type ReviewEmployerState = typeof REVIEW | typeof ADD | typeof EDIT

export const ReviewEmployers: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')
  const { claimFormValues } = useContext(ClaimFormContext)
  const employers = claimFormValues?.employers
  const { deleteEmployerAndSaveClaimFormValues } = useSaveClaimFormValues()
  const [state, setState] = useState<ReviewEmployerState>(REVIEW)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [employerIndex, setEmployerIndex] = useState(0)

  //Should be reevaluated on every render
  const hasEmployersFunc = () => {
    if (claimFormValues?.employers) {
      return !!claimFormValues.employers.find((employer) => {
        return employer.worked_for_imported_employer_in_last_18mo
      })
    }
    return false
  }

  const hasEmployers = hasEmployersFunc()

  const { initialValues } = useMemo(() => {
    const employers = claimFormValues?.employers
    const initialValues = employers
      ? employers.length > employerIndex
        ? employers[employerIndex | 0]
        : { ...EMPLOYER_SKELETON, ...{ is_imported: false, is_employer: true } }
      : { ...EMPLOYER_SKELETON }

    return { initialValues }
  }, [employerIndex, claimFormValues])

  const handleGoToEditEmployer = (index: number) => {
    setEmployerIndex(index)
    setState(EDIT)
  }

  const handleGoToAddEmployer = () => {
    setEmployerIndex(employers ? employers.length : 0)
    setState(ADD)
  }

  const handleGoToReviewEmployers = () => {
    setState(REVIEW)
    //setEmployerIndex(0)
  }

  return (
    <>
      {state === REVIEW && (
        <ClaimFormik<ClaimantInput>
          initialValues={pageInitialValues}
          validationSchema={pageDefinition.validationSchema}
          heading={pageDefinition.heading}
          index={pageDefinitions.indexOf(pageDefinition)}
        >
          {({ values }) => {
            //Set in the values that this page has been visited once you get here
            useEffect(() => {
              values.LOCAL_reviewed_employers = true
            }, [])

            const employers = values?.employers
            const lastEmployerIndex = findLastIndex(employers, (employer) => {
              return !!employer.worked_for_imported_employer_in_last_18mo
            })

            const { previousPageLocal } = useMemo(() => {
              if (lastEmployerIndex === -1) {
                return { previousPageLocal: previousPage.path }
              }
              return {
                previousPageLocal: `${Routes.CLAIM.EDIT_EMPLOYER}/${lastEmployerIndex}`,
              }
            }, [lastEmployerIndex])

            /* Immediately change local value to prevent any state issues from happening.
            Willing to talk about this solution, but I think this is the best one
            Considering that someone people could have terrible internet connections
            We could also do a mutation here, but I think that potentially could cause
            a dangerous race condition */
            const handleDeleteEmployer = async (index: number) => {
              if (employers && employers?.length > index) {
                setIsDeleting(true)
                const newValues = await deleteEmployerAndSaveClaimFormValues(
                  index.toString()
                )
                if (newValues?.employers) values.employers = newValues.employers
                setIsDeleting(false)
              }
            }

            return (
              <>
                <SummaryBox
                  className="margin-bottom-4"
                  data-testid="review-employers"
                >
                  <SummaryBoxContent>
                    {hasEmployers && (
                      <Trans
                        t={t}
                        i18nKey="review_employers.preamble.default"
                      ></Trans>
                    )}
                    {!hasEmployers &&
                      values?.screener_job_last_eighteen_months && (
                        <Trans
                          t={t}
                          i18nKey="review_employers.preamble.had_work"
                        >
                          <Link variant="nav" href={Routes.SCREENER}>
                            {''}
                          </Link>
                        </Trans>
                      )}
                    {!hasEmployers &&
                      !values?.screener_job_last_eighteen_months && (
                        <Trans
                          t={t}
                          i18nKey="review_employers.preamble.no_work"
                        >
                          <Link variant="nav" href={Routes.SCREENER}>
                            {''}
                          </Link>
                        </Trans>
                      )}
                  </SummaryBoxContent>
                </SummaryBox>
                {employers?.map((employer, index) => {
                  if (
                    employer.worked_for_imported_employer_in_last_18mo === false
                  )
                    return

                  return (
                    <div
                      className="margin-bottom-4"
                      key={index}
                      data-testid={employer.employer_name}
                    >
                      <h2 className="font-heading-lg margin-bottom-0">
                        {employer.employer_name}
                      </h2>
                      <Button
                        aria-label={t('review_employers.edit_employer.label', {
                          employer: employer.employer_name,
                        })}
                        type="button"
                        unstyled
                        className="usa-button width-auto"
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.preventDefault()
                          handleGoToEditEmployer(index)
                        }}
                      >
                        {t('review_employers.edit_employer.edit_details')}
                      </Button>
                      {!employer.is_imported && (
                        <Button
                          aria-label={t(
                            'review_employers.edit_employer.delete_label',
                            {
                              employer: employer.employer_name,
                            }
                          )}
                          className="usa-button width-auto margin-left-2"
                          unstyled
                          type="button"
                          disabled={isDeleting}
                          onClick={async (e) => {
                            e.preventDefault()
                            await handleDeleteEmployer(index)
                          }}
                        >
                          {t('review_employers.edit_employer.delete')}
                        </Button>
                      )}
                    </div>
                  )
                })}
                {(hasEmployers ||
                  values?.screener_job_last_eighteen_months) && (
                  <Button
                    type="button"
                    className="usa-button usa-button--outline width-auto"
                    disabled={isDeleting}
                    onClick={() => handleGoToAddEmployer()}
                  >
                    {t('review_employers.add_employer')}
                  </Button>
                )}
                <ClaimFormButtons nextStep={nextPage.heading}>
                  <BackButton
                    disabled={isDeleting}
                    previousPage={previousPageLocal}
                  />
                  <NextButton disabled={isDeleting} nextPage={nextPage.path} />
                </ClaimFormButtons>
              </>
            )
          }}
        </ClaimFormik>
      )}

      {state === EDIT && (
        <EmployerFormik
          index={employerIndex.toString()}
          pageIndex={pageDefinitions.indexOf(pageDefinition)}
          heading={EditEmployerPageDefinition.heading}
          initialValues={initialValues}
          validationSchema={yupEditEmployer}
        >
          <EditEmployer />
          <ClaimFormButtons>
            <Button
              type="button"
              data-testid="back-button"
              className="usa-button usa-button--outline width-auto"
              onClick={() => handleGoToReviewEmployers()}
            >
              {t('pagination.previous')}
            </Button>
            <ReviewEmployersNextButton
              type="edit"
              onClick={() => handleGoToReviewEmployers()}
            />
          </ClaimFormButtons>
        </EmployerFormik>
      )}
      {state === ADD && (
        <EmployerFormik
          index={employerIndex.toString()}
          pageIndex={pageDefinitions.indexOf(pageDefinition)}
          heading={i18n_claimForm.t('review_employers.add_employer')}
          initialValues={initialValues}
          validationSchema={yupEditEmployer}
        >
          <EditEmployer />
          <ClaimFormButtons>
            <Button
              type="button"
              data-testid="back-button"
              className="usa-button usa-button--outline width-auto"
              onClick={() => handleGoToReviewEmployers()}
            >
              {t('pagination.previous')}
            </Button>
            <ReviewEmployersNextButton
              type="add"
              onClick={() => handleGoToReviewEmployers()}
            />
          </ClaimFormButtons>
        </EmployerFormik>
      )}
    </>
  )
}

ReviewEmployers.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default ReviewEmployers
