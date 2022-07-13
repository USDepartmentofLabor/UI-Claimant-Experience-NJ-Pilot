import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Fieldset } from '@trussworks/react-uswds'
import { useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import Address from '../Address/Address'
import { CheckboxField } from '../fields/CheckboxField/CheckboxField'
import { ADDRESS_SKELETON } from 'constants/initialValues'
import { ClaimantInput } from 'types/claimantInput'

export const ClaimantAddress = () => {
  const { t } = useTranslation('contact')

  const { values, setFieldValue } = useFormikContext<ClaimantInput>()

  // Keep mailing_address synchronized if checked
  useEffect(() => {
    if (values.LOCAL_mailing_address_same) {
      setFieldValue('mailing_address', { ...values.residence_address })
    }
  }, [values.LOCAL_mailing_address_same, values.residence_address])

  return (
    <>
      <Fieldset legend={t('label.primary_address')}>
        <Address basename="residence_address" />
      </Fieldset>
      <CheckboxField
        name="LOCAL_mailing_address_same"
        data-testid="LOCAL_mailing_address_same"
        label={t('label.mailing_address_same')}
        onChange={(e) => {
          // Reset mailing_address if unchecked and identical
          if (
            !e.target.checked &&
            isEqual(values.mailing_address, values.residence_address)
          ) {
            setFieldValue('mailing_address', { ...ADDRESS_SKELETON })
          }
        }}
      />
      {!values.LOCAL_mailing_address_same && (
        <Fieldset legend={t('label.mailing_address')}>
          <Address basename="mailing_address" />
        </Fieldset>
      )}
    </>
  )
}
