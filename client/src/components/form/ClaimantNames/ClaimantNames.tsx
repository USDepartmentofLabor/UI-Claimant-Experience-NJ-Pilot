import { Fieldset } from '@trussworks/react-uswds'
import { FieldArray, useFormikContext } from 'formik'
import { Name } from '../Name/Name'
import { PERSON_NAME_SKELETON } from 'constants/initialValues'
import { YesNoQuestion } from '../YesNoQuestion/YesNoQuestion'
import { useTranslation } from 'react-i18next'
import { LiveMessenger } from 'react-aria-live'
import { ClaimantNameInput } from 'types/claimantInput'
import { ChangeEventHandler } from 'react'
import styles from 'styles/pages/claim/personal.module.scss'

export const ClaimantNames = () => {
  const { values } = useFormikContext<ClaimantNameInput>()
  const { t } = useTranslation('claimForm', { keyPrefix: 'name' })
  const { t: tCommon } = useTranslation('common')

  return (
    <LiveMessenger>
      {({ announcePolite }) => (
        <>
          <FieldArray
            name="alternate_names"
            render={(arrayHelpers) => {
              const handleHasAlternateNamesChange: ChangeEventHandler<
                HTMLInputElement
              > = (e) => {
                if (e.target.value === 'yes') {
                  if (values.alternate_names.length === 0) {
                    arrayHelpers.push({ ...PERSON_NAME_SKELETON })
                  }
                  announcePolite(tCommon('expanded_content.revealed'))
                } else {
                  values.alternate_names.forEach((alternateName, index) => {
                    arrayHelpers.remove(index)
                  })
                  announcePolite(tCommon('expanded_content.collapsed'))
                }
              }

              const alternateNames = values.alternate_names.map(
                (alternateName, index) => {
                  const name = `alternate_names.${index}`
                  return <Name key={name} name={name} />
                }
              )

              return (
                <>
                  <YesNoQuestion
                    question={t('claimant_has_alternate_names.label')}
                    name="LOCAL_claimant_has_alternate_names"
                    onChange={handleHasAlternateNamesChange}
                  />
                  {alternateNames.length > 0 && (
                    <Fieldset
                      aria-label="alternate name"
                      className={styles.alt_name}
                    >
                      {alternateNames}
                    </Fieldset>
                  )}
                </>
              )
            }}
          />
        </>
      )}
    </LiveMessenger>
  )
}
