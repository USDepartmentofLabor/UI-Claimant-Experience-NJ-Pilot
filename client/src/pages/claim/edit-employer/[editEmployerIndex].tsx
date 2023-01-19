import {
  EditEmployer,
  EMPLOYER_SKELETON,
  yupEditEmployer,
} from 'components/form/EditEmployer/EditEmployer'
import Error from 'next/error'
import { ReactNode, useContext, useMemo } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { RecentEmployersPageDefinition } from 'constants/pages/definitions/recentEmployersPageDefinition'
import { EmployerFormik } from 'components/form/EmployerFormik/EmployerFormik'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import { getNextPage, pageDefinitions } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
import { EditEmployerPageDefinition } from 'constants/pages/definitions/editEmployerPageDefinition'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { EmployerBackButton } from 'components/form/ClaimFormButtons/EmployerBackButton/EmployerBackButton'
import { findLastIndex } from 'lodash'

const nextPage = getNextPage(RecentEmployersPageDefinition)

export const EditEmployers: NextPageWithLayout = () => {
  const { claimFormValues } = useContext(ClaimFormContext)
  const router = useRouter()
  const editEmployerIndex = router.query.editEmployerIndex as string
  const editEmployerIndexNum = parseInt(editEmployerIndex)

  const { initialValues, isValidIndex } = useMemo(() => {
    const isValidIndex =
      claimFormValues?.employers &&
      claimFormValues.employers.length > editEmployerIndexNum &&
      editEmployerIndexNum >= 0 &&
      claimFormValues.employers[parseInt(editEmployerIndex)]
        .worked_for_imported_employer_in_last_18mo

    const initialValues = claimFormValues?.employers
      ? claimFormValues.employers[parseInt(editEmployerIndex)]
      : EMPLOYER_SKELETON

    return { initialValues, isValidIndex }
  }, [editEmployerIndex, claimFormValues])

  const getNextIndex = () => {
    const employers = claimFormValues?.employers
    const index = employers?.findIndex(
      (employer, index) =>
        index > editEmployerIndexNum &&
        employer.worked_for_imported_employer_in_last_18mo
    )
    return index !== -1 ? index : null
  }

  const getPreviousIndex = () => {
    const employers = claimFormValues?.employers
    const index = findLastIndex(
      employers?.slice(0, editEmployerIndexNum),
      (employer) => employer.worked_for_imported_employer_in_last_18mo == true
    )
    return index !== -1 ? index : null
  }

  const getNextPage = () => {
    const nextIndex = getNextIndex()
    if (nextIndex !== null) {
      return `${Routes.CLAIM.EDIT_EMPLOYER}/${nextIndex}`
    }
    return nextPage.path
  }

  const getPreviousPage = () => {
    if (parseInt(editEmployerIndex) > 0 && getPreviousIndex() != null) {
      return `${Routes.CLAIM.EDIT_EMPLOYER}/${getPreviousIndex()}`
    }
    return RecentEmployersPageDefinition.path
  }

  const getNextPageHeading = () => {
    const nextIndex = getNextIndex()
    if (nextIndex !== null) {
      return EditEmployerPageDefinition.heading
    }
    return nextPage.heading
  }

  return !isValidIndex ? (
    <Error statusCode={404} />
  ) : (
    <EmployerFormik
      index={editEmployerIndex}
      pageIndex={pageDefinitions.indexOf(RecentEmployersPageDefinition)}
      heading={EditEmployerPageDefinition.heading}
      initialValues={initialValues}
      validationSchema={yupEditEmployer}
    >
      <EditEmployer />
      <ClaimFormButtons nextStep={getNextPageHeading()}>
        <EmployerBackButton
          index={editEmployerIndex}
          previousPage={getPreviousPage()}
        />
        <NextButton nextPage={getNextPage()} />
      </ClaimFormButtons>
    </EmployerFormik>
  )
}

EditEmployers.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={EditEmployerPageDefinition}
      index={pageDefinitions.indexOf(RecentEmployersPageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default EditEmployers
