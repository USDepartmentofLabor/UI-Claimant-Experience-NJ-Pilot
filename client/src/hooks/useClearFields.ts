import { useCallback } from 'react'
import { FormikContextType, useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'
import { ClaimantInput } from 'types/claimantInput'
import {
  ClearFieldFunction,
  ClearFieldsFunction,
  DEFAULT_TOUCHED,
} from 'types/ClearFieldTypes'

/**
 * Gets convenience functions for clearing fields when given the appropriate formik helpers
 * Why are these functions async? setFieldValue is actually an async function. The type definition is incorrect.
 * If setFieldValue is not awaited within a change event handler, formik will not validate the form on change. This
 * can cause validation rendering to be delayed to the next render (e.g. typically the next blur event)
 *
 * Source: https://github.com/jaredpalmer/formik/issues/2059#issuecomment-1338542955
 */
export const getClearFieldsFunctions = (
  getFieldMeta: FormikContextType<ClaimantInput>['getFieldMeta'],
  setFieldValue: FormikContextType<ClaimantInput>['setFieldValue'],
  setFieldTouched: FormikContextType<ClaimantInput>['setFieldTouched']
): {
  clearField: ClearFieldFunction
  clearFields: ClearFieldsFunction
} => {
  const clear = useCallback(
    async (fieldName: string, value: unknown, touched: boolean) => {
      const meta = getFieldMeta(fieldName)
      if (!isEqual(meta.value, value)) {
        await setFieldValue(fieldName, value)
      }
      if (!isEqual(meta.touched, touched)) {
        setFieldTouched(fieldName, touched)
      }
    },
    [getFieldMeta, setFieldValue, setFieldTouched]
  )

  const clearField = async (
    field: string,
    value: unknown,
    touched: boolean = DEFAULT_TOUCHED
  ) => {
    await clear(field, value, touched)
  }

  /**
   * Convenience for clearing multiple fields. While clear operations are async,
   * they each must be awaited in series for proper Formik state update and
   * validation behavior
   * @param fields
   */
  const clearFields = async (fields: { [field: string]: unknown }) => {
    for (const [field, value] of Object.entries(fields)) {
      await clearField(field, value)
    }
  }

  return {
    clearField,
    clearFields,
  }
}

export const useClearFields = () => {
  const { getFieldMeta, setFieldValue, setFieldTouched } =
    useFormikContext<ClaimantInput>()

  return getClearFieldsFunctions(getFieldMeta, setFieldValue, setFieldTouched)
}
