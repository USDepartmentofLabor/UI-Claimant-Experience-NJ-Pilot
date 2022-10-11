import { Trans, useTranslation } from 'react-i18next'
import { Fieldset } from '@trussworks/react-uswds'
import { useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import Address from '../Address/Address'
import { CheckboxField } from '../fields/CheckboxField/CheckboxField'
import { ADDRESS_SKELETON } from 'constants/initialValues'
import { ClaimantInput } from 'types/claimantInput'
import { ChangeEventHandler } from 'react'

export const ClaimantAddress = () => {
  const { t } = useTranslation('contact')

  const { values, setFieldValue } = useFormikContext<ClaimantInput>()

  const handleResidenceAddressChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const addressSubfieldName = e.target
      .getAttribute('name')
      ?.replace('residence_address.', '')

    // Keep mailing_address synchronized with residence_address if LOCAL_mailing_address_same is checked
    if (values.LOCAL_mailing_address_same && addressSubfieldName) {
      const updatedValue = {
        ...values.residence_address,
        [addressSubfieldName]: e.currentTarget.value,
      }
      setFieldValue('mailing_address', updatedValue)
    }
  }

  return (
    <>
      <Fieldset legend={<Trans t={t} i18nKey="label.primary_address" />}>
        <Address
          basename="residence_address"
          onChange={handleResidenceAddressChange}
        />
      </Fieldset>
      <CheckboxField
        name="LOCAL_mailing_address_same"
        data-testid="LOCAL_mailing_address_same"
        label={t('label.mailing_address_same')}
        onChange={(e) => {
          const isBeingChecked = e.target.checked
          const addressesAreEqual = isEqual(
            values.mailing_address,
            values.residence_address
          )

          if (isBeingChecked) {
            // Sync address if being checked and
            if (!addressesAreEqual) {
              setFieldValue('mailing_address', { ...values.residence_address })
            }
          } else {
            // Reset mailing_address if being unchecked
            setFieldValue('mailing_address', { ...ADDRESS_SKELETON })
          }
        }}
      />
      {!values.LOCAL_mailing_address_same && (
        <Fieldset legend={<Trans t={t} i18nKey="label.mailing_address" />}>
          <Address basename="mailing_address" />
        </Fieldset>
      )}
    </>
  )
}
