import { useTranslation, Trans } from 'react-i18next'
import { NextPageWithLayout } from 'pages/_app'
import { ClaimFormLayout } from 'components/layouts/ClaimFormLayout/ClaimFormLayout'
import { OccupationInput } from 'types/claimantInput'
import ClaimFormButtons from 'components/form/ClaimFormButtons/ClaimFormButtons'
import { BackButton } from 'components/form/ClaimFormButtons/BackButton/BackButton'
import { NextButton } from 'components/form/ClaimFormButtons/NextButton/NextButton'
import TextField from 'components/form/fields/TextField/TextField'
import TextAreaField from 'components/form/fields/TextAreaField/TextAreaField'
import {
  Alert,
  Icon,
  Link,
  SummaryBox,
  SummaryBoxContent,
} from '@trussworks/react-uswds'
import { debounce } from 'lodash'

import {
  getNextPage,
  getPreviousPage,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { OccupationPageDefinition } from 'constants/pages/definitions/occupationPageDefinition'

import { ReactNode, useCallback, useEffect, useState } from 'react'
import { ClaimFormik } from 'components/form/ClaimFormik/ClaimFormik'
import { useOccupationsSearch } from 'queries/useOccupations'
import { useFormikContext } from 'formik'
import Spinner from 'components/Spinner/Spinner'
import { RadioField } from 'components/form/fields/RadioField/RadioField'

const pageDefinition = OccupationPageDefinition
const nextPage = getNextPage(pageDefinition)
const previousPage = getPreviousPage(pageDefinition)

const pageInitialValues: OccupationInput = {
  job_title: '',
  job_description: '',
  occucoder_code: null,
  occucoder_job_title: null,
  occucoder_description: null,
  occucoder_score: null,
}

/**
 * Component solely responsible for searching for standardized occupations,
 * rendering the options, and managing the occucoder_* field state.
 */
function OccupationsSearchResults(props: {
  onError: () => void
  onSearch: () => void
}) {
  const { setFieldValue, values } = useFormikContext<OccupationInput>()
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'occupation',
  })

  /**
   * Debounce the values so we don't make a request for every keystroke.
   */
  const [debouncedValues, setDebouncedValues] = useState({
    job_title: values.job_title,
    job_description: values.job_description,
  })
  const handleUserFieldChanges = useCallback(
    debounce(setDebouncedValues, 1000),
    []
  )

  /**
   * When the user changes the selected job code, we also want to store
   * the job's title and description
   */
  const handleOccupationCodeChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = evt.target
    const occupation = occupations?.find((o) => o.job_code === value)

    if (occupation) {
      // These are indeed async
      // https://github.com/jaredpalmer/formik/issues/2059#issuecomment-1338542955
      await setFieldValue('occucoder_job_title', occupation.job_title)
      await setFieldValue('occucoder_description', occupation.job_description)
      await setFieldValue('occucoder_score', occupation.score)
    }
  }

  /**
   * Get the list of occupations from the API
   */
  const {
    isLoading,
    isError,
    data: occupations,
  } = useOccupationsSearch({
    job_title: debouncedValues.job_title,
    job_description: debouncedValues.job_description,
  })

  /**
   * Queue an update to the debounced values when the user makes a change
   */
  useEffect(() => {
    handleUserFieldChanges({
      job_title: values.job_title,
      job_description: values.job_description,
    })
  }, [values.job_title, values.job_description])

  /**
   * Make sure a previously selected occupation is cleared
   * if the list of search results changes.
   */
  useEffect(() => {
    if (values.occucoder_code) {
      setFieldValue('occucoder_code', null)
      setFieldValue('occucoder_job_title', null)
      setFieldValue('occucoder_description', null)
      setFieldValue('occucoder_score', null)
    }
  }, [occupations, setFieldValue])

  useEffect(() => {
    if (isError) props.onError()
    if (isLoading) props.onSearch()
  }, [isError, isLoading, props.onError, props.onSearch])

  if (isLoading) {
    return (
      <Spinner
        data-testid="occupations-search-spinner"
        className="margin-top-2"
        label={t('search_loading')}
      />
    )
  }

  /**
   * If there are no occupations due to search service being down, or some other
   * system error, then we don't show anything and allow the claimant to proceed.
   */
  if (isError || !occupations) {
    return null
  }

  if (!occupations.length) {
    return (
      <Alert slim headingLevel="h3" type="error" aria-live="polite">
        {t('search_no_matches_error')}
      </Alert>
    )
  }

  return (
    <>
      <div aria-live="polite" className="usa-sr-only">
        {t('search_results_count', {
          count: occupations.length,
          job_title: debouncedValues.job_title,
        })}
      </div>
      <RadioField
        tile
        name="occucoder_code"
        legend={t('occucoder_code.label')}
        onChange={handleOccupationCodeChange}
        options={occupations.map((occupation) => {
          return {
            value: occupation.job_code,
            label: occupation.job_title,
            labelDescription: occupation.job_description,
          }
        })}
      />
      <input
        type="hidden"
        name="occucoder_job_title"
        data-testid="occucoder_job_title"
        value={values.occucoder_job_title ?? ''}
      />
      <input
        type="hidden"
        name="occucoder_description"
        data-testid="occucoder_description"
        value={values.occucoder_description ?? ''}
      />
      <input
        type="hidden"
        name="occucoder_score"
        data-testid="occucoder_score"
        value={values.occucoder_score ?? ''}
      />
    </>
  )
}

function OccupationFields() {
  const [searchHasError, setSearchHasError] = useState(false)
  const { values } = useFormikContext<OccupationInput>()
  const { t } = useTranslation('claimForm', {
    keyPrefix: 'occupation',
  })

  const isSubmitDisabled = !values.occucoder_code && !searchHasError

  return (
    <>
      <SummaryBox>
        <SummaryBoxContent>
          <Trans t={t} i18nKey="choose_the_occupation">
            <Link variant="external" href={t('reemployment_profile_link')}>
              {''}
            </Link>
          </Trans>
        </SummaryBoxContent>
      </SummaryBox>

      <TextField
        label={t('job_title.label')}
        aria-describedby="sr-search-help"
        type="search"
        name="job_title"
        id="job_title"
        inputSuffix={<Icon.Search />}
      />
      <TextAreaField
        label={t('job_description.label')}
        name="job_description"
        id="job_description"
        characterLimit={255}
      />

      <div className="usa-sr-only" id="sr-search-help">
        {t('sr_search_help')}
      </div>

      <OccupationsSearchResults
        onError={() => setSearchHasError(true)}
        onSearch={() => setSearchHasError(false)}
      />

      <ClaimFormButtons nextStep={nextPage.heading}>
        <BackButton previousPage={previousPage.path} />
        <NextButton nextPage={nextPage.path} disabled={isSubmitDisabled} />
      </ClaimFormButtons>
    </>
  )
}

const Occupation: NextPageWithLayout = () => {
  return (
    <ClaimFormik<OccupationInput>
      initialValues={pageInitialValues}
      validationSchema={pageDefinition.validationSchema}
      heading={pageDefinition.heading}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      <OccupationFields />
    </ClaimFormik>
  )
}

Occupation.getLayout = (page: ReactNode) => {
  return (
    <ClaimFormLayout
      pageDefinition={pageDefinition}
      index={pageDefinitions.indexOf(pageDefinition)}
    >
      {page}
    </ClaimFormLayout>
  )
}

export default Occupation
