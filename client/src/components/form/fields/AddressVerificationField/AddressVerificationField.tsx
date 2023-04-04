import { useField } from 'formik'
import {
  Radio,
  FormGroup,
  ErrorMessage,
  Fieldset,
} from '@trussworks/react-uswds'

import { AddressInput } from 'types/claimantInput'
import { ChangeEvent, ComponentProps, ReactNode, useRef } from 'react'

import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

import styles from './AddressVerificationField.module.scss'
import { useGetVerifiedAddress } from 'queries/useGetVerifiedAddress'
import { ADDRESS_SKELETON } from 'constants/initialValues'
import { useTranslation } from 'next-i18next'

type RadioInputProps = Optional<
  Omit<ComponentProps<typeof Radio>, 'label' | 'value'>,
  'id'
>

type ChangeAddressfunction = (address: AddressInput) => AddressInput

interface IAddressVerificationFieldProps extends RadioInputProps {
  address: AddressInput
  errorMessage?: string
  showsErrors?: boolean
  legend?: ReactNode
  fieldsetClassName?: string
  hint?: ReactNode
  changeAddress: ChangeAddressfunction
}

export const AddressVerificationField = ({
  address,
  changeAddress,
  legend,
  fieldsetClassName,
  errorMessage,
  showsErrors = true,
  hint,
  name,
  ...inputProps
}: IAddressVerificationFieldProps & JSX.IntrinsicElements['input']) => {
  const { t } = useTranslation('claimForm')
  const [fieldProps, metaProps] = useField(name)
  const showError = showsErrors && useShowErrors(name)
  const radioRef = useRef<HTMLInputElement>(null)
  const verifiedAddressData = useGetVerifiedAddress(address)

  useFocusFirstError(metaProps.error, radioRef)

  const options = [
    {
      label: 'address_verification.entered',
      address,
      value: 'AS_ENTERED',
    },
    {
      label: 'address_verification.verified',
      address: verifiedAddressData?.data?.data?.address ?? ADDRESS_SKELETON,
      value: 'AS_VERIFIED',
    },
  ]

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    const addressValue = value === 'AS_VERIFIED' ? options[1] : options[0]

    fieldProps.onChange(e)
    changeAddress?.(addressValue.address)
  }

  return (
    <FormGroup error={showError}>
      <Fieldset
        legend={legend}
        className={`${fieldsetClassName} ${styles.fieldsetLegend} ${
          showError && styles.errorLegend
        }`}
        onInvalid={(e) => e.preventDefault()}
      >
        {hint && (
          <span className="usa-hint" id={`${name}.hint`}>
            {hint}
          </span>
        )}
        {showError && (
          <ErrorMessage>{errorMessage || metaProps.error}</ErrorMessage>
        )}

        {options.map((option, index) => {
          const label = (
            <div>
              <div className={`margin-bottom-1`}>{t(option.label)}</div>
              <div>
                <div>{option.address.address}</div>
                <div>
                  {option.address.city}, {option.address.state}{' '}
                  {option.address.zipcode}
                </div>
              </div>
            </div>
          )

          return (
            <Radio
              {...fieldProps}
              name={name}
              id={`${name}.${option.value}`}
              data-testid={`${name}.${option.value}`}
              key={`${option.value}.${index}`}
              label={label}
              value={option.value}
              checked={metaProps.value === option.value}
              onChange={handleChange}
              inputRef={index === 0 ? radioRef : undefined}
              tile={true}
              {...inputProps}
            />
          )
        })}
      </Fieldset>
    </FormGroup>
  )
}
