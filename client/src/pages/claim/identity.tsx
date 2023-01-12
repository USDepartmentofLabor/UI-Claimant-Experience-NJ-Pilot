import { useTranslation } from 'react-i18next'
import TextField from 'components/form/fields/TextField/TextField'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import TextAreaField from 'components/form/fields/TextAreaField/TextAreaField'
import { authorizationTypeOptions } from 'constants/formOptions'
import { VerifiedFields } from 'components/form/VerifiedFields/VerifiedFields'
import { VerifiedField } from 'components/form/VerifiedFields/VerifiedField/VerifiedField'
import { formatStoredDateToDisplayDate } from 'utils/date/format'
import { ChangeEventHandler } from 'react'
import { NextPageWithLayout } from 'pages/_app'
import { ReactNode } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { IdentityPageDefinition } from 'constants/pages/definitions/identityPageDefinition'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { IdentityInput } from 'types/claimantInput'

const pageDefinition = IdentityPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

export const Identity: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')
  const { t: tSsn } = useTranslation('ssn')

  return (
    <ClaimFormik<IdentityInput>
      initialValues={pageDefinition.initialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values, initialValues, clearField, clearFields }) => {
        const showWorkAuthorizationFields = values.authorized_to_work

        const showAlienRegistrationNumber =
          values.authorization_type &&
          values.authorization_type !== 'US_citizen_or_national'

        const showNotAllowedToWorkInUSExplanation =
          values.authorized_to_work === false

        const handleAuthorizedToWorkChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'no') {
            await clearFields([
              'authorization_type',
              'alien_registration_number',
            ])
          }
          if (e.target.value === 'yes') {
            await clearField('not_authorized_to_work_explanation')
          }
        }
        const handleAuthorizationTypeChange: ChangeEventHandler<
          HTMLSelectElement
        > = async (e) => {
          if (e.target.value === 'US_citizen_or_national') {
            await clearField('alien_registration_number')
          }
        }

        return (
          <>
            {(initialValues.ssn || initialValues.birthdate) && (
              <VerifiedFields>
                {initialValues.ssn && (
                  <VerifiedField
                    label={tSsn('label')}
                    value={initialValues.ssn}
                  />
                )}
                {initialValues.birthdate && (
                  <VerifiedField
                    label={t('birthdate.label')}
                    value={formatStoredDateToDisplayDate(
                      initialValues.birthdate
                    )}
                  />
                )}
              </VerifiedFields>
            )}
            <TextField
              label={t('drivers_license_or_state_id_number.label')}
              name="drivers_license_or_state_id_number"
              type="text"
            />
            <YesNoQuestion
              question={t('work_authorization.authorized_to_work.label')}
              name="authorized_to_work"
              onChange={handleAuthorizedToWorkChange}
            />
            {showNotAllowedToWorkInUSExplanation && (
              <TextAreaField
                label={t(
                  'work_authorization.not_authorized_to_work_explanation.label'
                )}
                name="not_authorized_to_work_explanation"
              />
            )}
            {showWorkAuthorizationFields && (
              <>
                <DropdownField
                  label={t('work_authorization.authorization_type.label')}
                  name="authorization_type"
                  startEmpty
                  options={authorizationTypeOptions.map((option) => ({
                    label: t(
                      `work_authorization.authorization_type.options.${option}`
                    ),
                    value: option,
                  }))}
                  onChange={handleAuthorizationTypeChange}
                />
                {showAlienRegistrationNumber && (
                  <TextField
                    label={t(
                      'work_authorization.alien_registration_number.label'
                    )}
                    name="alien_registration_number"
                    type="text"
                  />
                )}
              </>
            )}
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

Identity.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Identity
