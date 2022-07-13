import { Fieldset } from '@trussworks/react-uswds'
import { FieldArray, useFormikContext } from 'formik'
import { Name } from '../Name/Name'
import { PERSON_NAME_SKELETON } from 'constants/initialValues'
import { useClearFields } from '../../../hooks/useClearFields'
import { YesNoQuestion } from '../YesNoQuestion/YesNoQuestion'
import { useTranslation } from 'react-i18next'
import { LiveMessenger } from 'react-aria-live'
import { ClaimantInput } from 'types/claimantInput'

export const ClaimantNames = () => {
  const { values } = useFormikContext<ClaimantInput>()
  const { t } = useTranslation('claimForm', { keyPrefix: 'name' })
  const { t: tCommon } = useTranslation('common')

  useClearFields(values.LOCAL_claimant_has_alternate_names === false, {
    fieldName: 'alternate_names',
    value: [],
  })

  return (
    <>
      <Fieldset legend={t('legal_name')}>
        <Name name="claimant_name" />
      </Fieldset>
      <LiveMessenger>
        {({ announcePolite }) => (
          <YesNoQuestion
            question={t('claimant_has_alternate_names.label')}
            name="LOCAL_claimant_has_alternate_names"
            onChange={(e) => {
              e.currentTarget.value === 'yes'
                ? announcePolite(tCommon('expanded_content.revealed'))
                : announcePolite(tCommon('expanded_content.collapsed'))
            }}
          />
        )}
      </LiveMessenger>

      {values.LOCAL_claimant_has_alternate_names === true && (
        <Fieldset legend={t('alternate_name')}>
          <FieldArray
            name="alternate_names"
            render={() => {
              values.alternate_names?.length === 0 &&
                values.alternate_names.push({ ...PERSON_NAME_SKELETON })
              return values.alternate_names?.map((alternateName, index) => {
                const name = `alternate_names.${index}`
                return <Name key={name} name={name} />
              })
            }}
          />
        </Fieldset>
      )}
    </>
  )
}
