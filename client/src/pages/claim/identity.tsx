import { useTranslation } from 'react-i18next'
import TextField from 'components/form/fields/TextField/TextField'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import {
  authorizationTypeOptions,
  countryOfOriginOptions,
  EMPTY_DROPDOWN_OPTION,
  UNTOUCHED_RADIO_VALUE,
} from 'constants/formOptions'
import { VerifiedFields } from 'components/form/VerifiedFields/VerifiedFields'
import { VerifiedField } from 'components/form/VerifiedFields/VerifiedField/VerifiedField'
import { formatStoredDateToDisplayDate } from 'utils/date/format'
import { ChangeEventHandler, MouseEventHandler, useRef } from 'react'
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
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { Name } from 'components/form/Name/Name'
import { Trans } from 'next-i18next'
import {
  Button,
  ButtonGroup,
  Fieldset,
  ModalFooter,
  ModalHeading,
  ModalOpenLink,
  ModalToggleButton,
} from '@trussworks/react-uswds'
import { Modal, ModalRef } from '@trussworks/react-uswds'
import { AlienRegistrationNumberField } from 'components/form/fields/AlienRegistrationNumberField/AlienRegistrationNumberField'
import { PERSON_NAME_SKELETON } from 'constants/initialValues'

const pageDefinition = IdentityPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

export const pageInitialValues = {
  ssn: '',
  birthdate: '',
  has_nj_issued_id: UNTOUCHED_RADIO_VALUE,
  drivers_license_or_state_id_number: '',
  authorization_type: UNTOUCHED_RADIO_VALUE,
  employment_authorization_document_name: { ...PERSON_NAME_SKELETON },
  alien_registration_number: '',
  LOCAL_re_enter_alien_registration_number: '',
  country_of_origin: EMPTY_DROPDOWN_OPTION,
  employment_authorization_start_date: '',
  employment_authorization_end_date: '',
}

export const countryOfOriginDropdownOptions = countryOfOriginOptions.map(
  (option) => ({
    value: option,
    label: option,
  })
)

export const Identity: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')
  const { t: tSsn } = useTranslation('ssn')
  const modalRef = useRef<ModalRef>(null)

  return (
    <ClaimFormik<IdentityInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values, initialValues, clearField, clearFields }) => {
        const showVerifiedFields = initialValues.ssn || initialValues.birthdate

        const showAlienRegistrationNumber =
          values.authorization_type &&
          values.authorization_type !== 'US_citizen_or_national'
        const showOptionalAlienRegistrationNumber =
          values.authorization_type &&
          values.authorization_type === 'not_legally_allowed_to_work_in_US'

        const handleImmigrationHelpLinkClick: MouseEventHandler<
          HTMLButtonElement
        > = () => {
          if (!modalRef || !modalRef.current) {
            return false
          }
          window.open(
            'https://www.immigrationhelp.org/learning-center/what-is-an-alien-registration-number/'
          )
          modalRef.current.toggleModal()
        }

        const handleHasNJIssuedIDChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'no') {
            await clearField(
              'drivers_license_or_state_id_number',
              pageInitialValues.drivers_license_or_state_id_number
            )
          }
        }

        const handleAuthorizationTypeChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          if (e.target.value === 'US_citizen_or_national') {
            await clearFields({
              employment_authorization_document_name:
                pageInitialValues.employment_authorization_document_name,
              alien_registration_number:
                pageInitialValues.alien_registration_number,
              LOCAL_re_enter_alien_registration_number:
                pageInitialValues.LOCAL_re_enter_alien_registration_number,
              country_of_origin: pageInitialValues.country_of_origin,
              employment_authorization_start_date:
                pageInitialValues.employment_authorization_start_date,
              employment_authorization_end_date:
                pageInitialValues.employment_authorization_end_date,
            })
          }
          if (e.target.value !== 'employment_authorization_or_card_or_doc') {
            await clearFields({
              employment_authorization_start_date:
                pageInitialValues.employment_authorization_start_date,
              employment_authorization_end_date:
                pageInitialValues.employment_authorization_end_date,
            })
          }
        }

        return (
          <>
            <Modal
              ref={modalRef}
              id="alien-registration-number-link-modal"
              aria-labelledby="alien-registration-number-link-modal-heading"
              aria-describedby="alien-registration-number-link-modal-description"
            >
              <ModalHeading id="alien-registration-number-link-modal-heading">
                {t(
                  'work_authorization.alien_registration_number.modal.heading'
                )}
              </ModalHeading>
              <ModalFooter>
                <ButtonGroup>
                  <Button
                    type="button"
                    name="immigrationHelpLink"
                    onClick={handleImmigrationHelpLinkClick}
                  >
                    Continue
                  </Button>
                  <ModalToggleButton
                    modalRef={modalRef}
                    closer
                    unstyled
                    className="padding-105 text-center"
                  >
                    Cancel
                  </ModalToggleButton>
                </ButtonGroup>
              </ModalFooter>
            </Modal>
            {showVerifiedFields && (
              <VerifiedFields>
                {initialValues.ssn && (
                  <VerifiedField
                    label={tSsn('label')}
                    value={tSsn('privacy')}
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
            {!initialValues.birthdate && (
              <DateInputField name="birthdate" legend={t('birthdate.label')} />
            )}
            <YesNoQuestion
              question={t('has_nj_issued_id.label')}
              name="has_nj_issued_id"
              onChange={handleHasNJIssuedIDChange}
            />
            {values.has_nj_issued_id === true && (
              <TextField
                label={t('drivers_license_or_state_id_number.label')}
                name="drivers_license_or_state_id_number"
                type="text"
              />
            )}
            <RadioField
              legend={t('work_authorization.authorization_type.label')}
              name="authorization_type"
              options={authorizationTypeOptions.map((option) => ({
                label: t(
                  `work_authorization.authorization_type.options.${option}`
                ),
                value: option,
              }))}
              onChange={handleAuthorizationTypeChange}
            />
            {showAlienRegistrationNumber && (
              <Fieldset
                className="form-section"
                legend={
                  <h2>
                    {t(
                      'work_authorization.employment_authorization_document_name.section_title'
                    )}
                  </h2>
                }
              >
                <Name name={'employment_authorization_document_name'} />
                <AlienRegistrationNumberField
                  label={
                    showOptionalAlienRegistrationNumber
                      ? t(
                          'work_authorization.alien_registration_number.optional_label'
                        )
                      : t('work_authorization.alien_registration_number.label')
                  }
                  name="alien_registration_number"
                  hint={
                    <Trans
                      t={t}
                      i18nKey="work_authorization.alien_registration_number.hint"
                    >
                      <ModalOpenLink
                        modalRef={modalRef}
                        href="https://www.immigrationhelp.org/learning-center/what-is-an-alien-registration-number/"
                      >
                        Open modal
                      </ModalOpenLink>
                    </Trans>
                  }
                  type="text"
                />
                <AlienRegistrationNumberField
                  label={t(
                    'work_authorization.re_enter_alien_registration_number.label'
                  )}
                  name="LOCAL_re_enter_alien_registration_number"
                  type="text"
                />
                <DropdownField
                  name="country_of_origin"
                  label={t('work_authorization.country_of_origin.label')}
                  data-testid="country_of_origin"
                  startEmpty
                  options={countryOfOriginDropdownOptions}
                />
                {values.authorization_type ===
                  'employment_authorization_or_card_or_doc' && (
                  <>
                    <DateInputField
                      name={`employment_authorization_start_date`}
                      legend={t(
                        'work_authorization.employment_authorization_start_date.label'
                      )}
                    />
                    <DateInputField
                      name={`employment_authorization_end_date`}
                      legend={t(
                        'work_authorization.employment_authorization_end_date.label'
                      )}
                    />
                  </>
                )}
              </Fieldset>
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
