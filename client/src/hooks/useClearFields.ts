import { useCallback } from 'react'
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

export const useClearFields = () => {
  const { getFieldMeta, setFieldValue, setFieldTouched } =
    useFormikContext<ClaimantInput>()

  const clear = useCallback(
    (fieldName: string, value: unknown, touched: boolean) => {
      const meta = getFieldMeta(fieldName)
      if (!isEqual(meta.value, value)) {
        setFieldValue(fieldName, value)
      }
      if (!isEqual(meta.touched, touched)) {
        setFieldTouched(fieldName, touched)
      }
    },
    [getFieldMeta, setFieldValue, setFieldTouched]
  )

  const clearField = (field: Field) => {
    if (isFieldWithConfiguredClear(field)) {
      const value = field.value || DEFAULT_VALUE
      const touched = field.touched || DEFAULT_TOUCHED
      clear(field.fieldName, value, touched)
    } else {
      clear(field, DEFAULT_VALUE, DEFAULT_TOUCHED)
    }
  }

  const clearFields = (fields: Field[]) => {
    fields.forEach((field) => clearField(field))
  }

  return {
    clearField,
    clearFields,
  }
}
