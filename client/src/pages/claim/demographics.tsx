import { SummaryBox, SummaryBoxContent } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'

import {
  ethnicityOptions,
  sexOptions,
  raceOptions,
  educationLevelOptions,
} from 'constants/formOptions'
import { RadioField } from 'components/form/fields/RadioField/RadioField'

import formStyles from 'components/form/form.module.scss'
import DropdownField from '../../components/form/fields/DropdownField/DropdownField'
import { DemographicsInput } from 'types/claimantInput'
import { ReactNode } from 'react'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { NextPageWithLayout } from 'pages/_app'
import { DemographicsPageDefinition } from 'constants/pages/definitions/demographicsPageDefinition'
import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'

const pageDefinition = DemographicsPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const Demographics: NextPageWithLayout = () => {
  const { t } = useTranslation('claimForm')

  return (
    <ClaimFormik<DemographicsInput>
      initialValues={pageDefinition.initialValues}
      validationSchema={pageDefinition.validationSchema}
    >
      {({ errors }) => {
        return (
          <>
            <SummaryBox>
              <SummaryBoxContent>
                {t('demographics.preamble')}
              </SummaryBoxContent>
            </SummaryBox>
            <RadioField
              name="sex"
              legend={t('sex.label')}
              className={formStyles.field}
              options={sexOptions.map((option) => {
                return {
                  label: t(`sex.options.${option}`),
                  value: option,
                }
              })}
            />
            <RadioField
              name="ethnicity"
              legend={t('ethnicity.label')}
              className={formStyles.field}
              options={ethnicityOptions.map((option) => {
                return {
                  label: t(`ethnicity.options.${option}`),
                  value: option,
                }
              })}
            />
            <RadioField
              name="race[0]"
              legend={t('race.label')}
              className={formStyles.field}
              options={raceOptions.map((option) => {
                return {
                  label: t(`race.options.${option}`),
                  value: option,
                }
              })}
              errorMessage={errors.race}
            />
            <DropdownField
              name="education_level"
              label={t('education_level.label')}
              startEmpty
              options={educationLevelOptions.map((option) => ({
                value: option,
                label: t(`education_level.options.${option}`),
              }))}
            />
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

Demographics.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Demographics
