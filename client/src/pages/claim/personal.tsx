import { ClaimantNames } from 'components/form/ClaimantNames/ClaimantNames'
import { ClaimantAddress } from 'components/form/ClaimantAddress/ClaimantAddress'

import { useTranslation } from 'next-i18next'
import { VerifiedFields } from 'components/form/VerifiedFields/VerifiedFields'
import { VerifiedField } from 'components/form/VerifiedFields/VerifiedField/VerifiedField'
import { PersonalInput } from 'types/claimantInput'
import { NextPageWithLayout } from 'pages/_app'
import { ReactNode } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { PersonalPageDefinition } from 'constants/pages/definitions/personalPageDefinition'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'

const pageDefinition = PersonalPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const Personal: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')
  const getLegalName = (
    first_name: string | undefined,
    middle_initial: string | undefined,
    last_name: string | undefined
  ) => {
    let legalName = ''
    const nameList = [first_name, middle_initial, last_name]
    nameList.forEach((name) => {
      if (name !== undefined) {
        if (legalName !== '') {
          legalName += ' '
        }
        legalName += name
      }
    })

    return legalName
  }

  return (
    <ClaimFormik<PersonalInput>
      initialValues={pageDefinition.initialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values }) => {
        const legalName = getLegalName(
          values.claimant_name?.first_name,
          values.claimant_name?.middle_initial,
          values.claimant_name?.last_name
        )
        return (
          <>
            {legalName !== '' && (
              <VerifiedFields>
                <VerifiedField
                  label={t('personal.verified_legal_name.label')}
                  value={legalName}
                />
              </VerifiedFields>
            )}
            <ClaimantNames />
            <ClaimantAddress />

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

Personal.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Personal
