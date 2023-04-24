import { useTranslation } from 'react-i18next'

import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading,
} from '@trussworks/react-uswds'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { CheckboxGroupField } from 'components/form/fields/CheckboxGroupField/CheckboxGroupField'
import {
  disabilityTypeOptions,
  disabilityPaymentTypeOptions,
  UNTOUCHED_RADIO_VALUE,
} from 'constants/formOptions'
import { DisabilityStatusInput } from 'types/claimantInput'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'
import formStyles from 'components/form/form.module.scss'
import { ChangeEventHandler, ReactNode } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { NextPageWithLayout } from 'pages/_app'
import { DisabilityPageDefinition } from 'constants/pages/definitions/disabilityPageDefinition'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'

const pageDefinition = DisabilityPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const pageInitialValues = {
  disability_applied_to_or_received: [],
  disabled_immediately_before: UNTOUCHED_RADIO_VALUE,
  type_of_disability: UNTOUCHED_RADIO_VALUE,
  date_disability_began: '',
  recovery_date: '',
  contacted_last_employer_after_recovery: UNTOUCHED_RADIO_VALUE,
}

export const Disability: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')

  return (
    <ClaimFormik<DisabilityStatusInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {({ values, clearFields, setFieldValue }) => {
        const handleHasCollectedDisabilityChange: ChangeEventHandler<
          HTMLInputElement
        > = async (e) => {
          const userCheckedNone = e.target.value === 'none' && e.target.checked
          const userUncheckedDisabilityAndFamilyLeaveIsNotChecked =
            e.target.value === 'disability' &&
            !e.target.checked &&
            !values.disability_applied_to_or_received.includes('family_leave')
          const userUncheckedFamilyLeaveAndDisabilityIsNotChecked =
            e.target.value === 'family_leave' &&
            !e.target.checked &&
            !values.disability_applied_to_or_received.includes('disability')

          if (userCheckedNone) {
            // User checked 'none'
            await setFieldValue(
              'disability_applied_to_or_received',
              ['none'],
              true
            )
          }

          const conditionalFieldsWillBeHidden =
            userCheckedNone ||
            userUncheckedDisabilityAndFamilyLeaveIsNotChecked ||
            userUncheckedFamilyLeaveAndDisabilityIsNotChecked

          if (conditionalFieldsWillBeHidden) {
            await clearFields({
              disabled_immediately_before:
                pageInitialValues.disabled_immediately_before,
              type_of_disability: pageInitialValues.type_of_disability,
              date_disability_began: pageInitialValues.date_disability_began,
              recovery_date: pageInitialValues.recovery_date,
              contacted_last_employer_after_recovery:
                pageInitialValues.contacted_last_employer_after_recovery,
            })
          }
        }

        const hasCollectedDisability =
          values.disability_applied_to_or_received.includes('disability') ||
          values.disability_applied_to_or_received.includes('family_leave')

        return (
          <>
            <SummaryBox>
              <SummaryBoxHeading headingLevel="h2">
                {t('disability.info_alert.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <ul className="usa-list">
                  <li>{t('disability.info_alert.items.doctor_cert')}</li>
                  <li>{t('disability.info_alert.items.tdi')}</li>
                  <li>{t('disability.info_alert.items.workers_comp')}</li>
                </ul>
              </SummaryBoxContent>
            </SummaryBox>
            <CheckboxGroupField
              legend={t('disability.disability_applied_to_or_received.label')}
              name="disability_applied_to_or_received"
              options={disabilityPaymentTypeOptions.map((paymentOption) => ({
                label: t(
                  `disability.disability_applied_to_or_received.options.${paymentOption}`
                ),
                value: paymentOption,
                checkboxProps: {
                  onChange: handleHasCollectedDisabilityChange,
                  disabled:
                    values.disability_applied_to_or_received.includes('none') &&
                    paymentOption !== 'none',
                },
              }))}
            />

            {hasCollectedDisability && (
              <>
                <YesNoQuestion
                  question={t('disability.disabled_immediately_before.label')}
                  name="disabled_immediately_before"
                />
                <RadioField
                  name="type_of_disability"
                  legend={t('disability.type_of_disability.label')}
                  showsErrors={true}
                  fieldsetClassName={formStyles.field}
                  options={disabilityTypeOptions.map((option) => {
                    return {
                      label: t(
                        `disability.type_of_disability.options.${option}`
                      ),
                      value: option,
                    }
                  })}
                />

                <DateInputField
                  name="date_disability_began"
                  legend={t('disability.date_disability_began.label')}
                />
                <DateInputField
                  name="recovery_date"
                  legend={t('disability.recovery_date.label')}
                  hint={t('disability.recovery_date.help_text')}
                />
                <YesNoQuestion
                  question={t(
                    'disability.contacted_last_employer_after_recovery.label'
                  )}
                  name="contacted_last_employer_after_recovery"
                />
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

Disability.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Disability
