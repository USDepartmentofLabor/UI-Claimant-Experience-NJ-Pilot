import { useCallback, useEffect } from 'react'
import { useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'
import { ClaimantInput } from 'types/claimantInput'

const DEFAULT_VALUE = undefined
const DEFAULT_TOUCHED = false

type FieldWithConfiguredClear = {
  fieldName: string
  value?: unknown
  touched?: boolean
}

type Field = string | FieldWithConfiguredClear

const isFieldWithConfiguredClear = (
  field: Field
): field is FieldWithConfiguredClear =>
  (field as FieldWithConfiguredClear).fieldName !== undefined

export const useClearFields = (
  shouldClear: boolean | undefined,
  fields: Field | Field[]
) => {
  const {
    getFieldMeta,
    setFieldValue,
    setFieldTouched,
    isValidating,
    isSubmitting,
  } = useFormikContext<ClaimantInput>()

  const clearField = useCallback(
    (field: Field) => {
      const clear = (fieldName: string, value: unknown, touched: boolean) => {
        const meta = getFieldMeta(fieldName)
        if (!isEqual(meta.value, value)) {
          setFieldValue(fieldName, value)
        }
        if (!isEqual(meta.touched, touched)) {
          setFieldTouched(fieldName, touched)
        }
      }

      if (isFieldWithConfiguredClear(field)) {
        const value = field.value || DEFAULT_VALUE
        const touched = field.touched || DEFAULT_TOUCHED
        clear(field.fieldName, value, touched)
      } else {
        clear(field, DEFAULT_VALUE, DEFAULT_TOUCHED)
      }
    },
    [getFieldMeta, setFieldValue, setFieldTouched]
  )

  useEffect(() => {
    if (shouldClear && !isValidating && !isSubmitting) {
      if (Array.isArray(fields)) {
        fields.forEach((field) => clearField(field))
      } else {
        clearField(fields)
      }
    }
  }, [
    shouldClear,
    clearField,
    isValidating,
    isSubmitting,
    JSON.stringify(fields),
  ])
  // Note: If this does not satisfy ESLint (exhaustive-deps), the convenience
  //       of useClearFields should be reevaluated.
  //       In fact, if you find yourself here debugging infinite loops or race
  //       conditions, talk to Brandon and he'll help us delete this file.
}
